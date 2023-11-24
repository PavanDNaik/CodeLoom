require("dotenv").config();

const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_SECRETE_URI);

app.use(express.json());
app.use(cors());

const port = 5000;

function createFileOfCode(lang, code, callback) {
  if (lang == "python") {
    fs.writeFileSync("userProgramFiles/testPython.py", code);
  } else if (lang == "java") {
    fs.writeFileSync("userProgramFiles/testJava.java", code);
  } else if (lang == "c") {
    fs.writeFileSync("userProgramFiles/testCprogram.c", code);
  } else if (lang == "cpp") {
    fs.writeFileSync("userProgramFiles/testCppprogram.cpp", code);
  }
  callback();
}

function getResults(childProcess, callback) {
  let result = "";

  childProcess.stdout.on("data", (data) => {
    result += data;
  });

  childProcess.stderr.on("data", (data) => {
    result += data;
  });

  childProcess.on("close", (code) => {
    return callback(result);
  });
}

function getResultOfexe(childProcess, exec, callback) {
  let result = "";
  childProcess.stdout.on("data", (data) => {
    result += data;
  });

  childProcess.stderr.on("data", (err) => {
    if (err) result += err;
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      const runEXE = spawn("./" + exec, []);
      getResults(runEXE, (ret) => {
        callback(ret);
      });
    } else {
      callback(result);
    }
  });
}

function executeCode(lang, code, callback) {
  createFileOfCode(lang, code, () => {
    if (lang == "python") {
      const pythonProcess = spawn("python", ["userProgramFiles/testPython.py"]);
      getResults(pythonProcess, (ret) => {
        callback(ret);
      });
    } else if (lang == "java") {
      const javaProcess = spawn("javac", ["userProgramFiles/testJava.java"]);

      let compileError = "";

      javaProcess.stdout.on("data", (data) => {
        compileError += data;
      });

      javaProcess.stderr.on("data", (data) => {
        compileError += data;
      });
      javaProcess.on("close", (code) => {
        if (code == 0) {
          const runProcess = spawn("java", [
            "-cp",
            "userProgramFiles",
            "testJava",
          ]);
          getResults(runProcess, (ret) => {
            callback(ret);
          });
        } else {
          callback(compileError);
        }
      });
    } else if (lang == "c") {
      const cCompileProcess = spawn("gcc", [
        "userProgramFiles/testCprogram.c",
        "-o",
        "userProgramFiles/testCprogram",
      ]);
      getResultOfexe(
        cCompileProcess,
        "userProgramFiles/testCprogram",
        (ret) => {
          callback(ret);
        }
      );
    } else if (lang == "cpp") {
      const cppCompileProcess = spawn("g++", [
        "userProgramFiles/testCppprogram.cpp",
        "-o",
        "userProgramFiles/testCppprogram",
      ]);
      getResultOfexe(
        cppCompileProcess,
        "userProgramFiles/testCppprogram",
        (ret) => {
          callback(ret);
        }
      );
    }
  });
}

async function updateUsersProgressHistory(
  currentUserEmail,
  currentPnum,
  submisonInfo,
  latestCode,
  isSolved,
  submissionStatus
) {
  await mongoose
    .model("user")
    .findOne({ userEmail: currentUserEmail })
    .then((currentUser) => {
      if (!currentUser.problemsReached) {
        currentUser.problemsReached = new Map();
        currentUser.problemsReached.set(currentPnum, submisonInfo);
      } else if (!currentUser.problemsReached.get(currentPnum)) {
        currentUser.problemsReached.set(currentPnum, submisonInfo);
      } else {
        const previousHistory = currentUser.problemsReached.get(currentPnum);
        previousHistory.solved |= isSolved;
        previousHistory.lastSubmission = latestCode;
        previousHistory.submissions.push(submissionStatus);

        currentUser.problemsReached.set(currentPnum, previousHistory);
      }
      currentUser.save().catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

async function fetchTestCode(type, pnum, lang, callback) {
  mongoose
    .model("problems")
    .findOne({
      pnum,
    })
    .select(`${type}.${lang}`)
    .then((problem) => {
      callback(problem[type][lang]);
    })
    .catch((err) => {
      console.log(err);
    });
}
app.post("/run", (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;
  try {
    fetchTestCode("testCode", req.body.pnum, lang, (testCode) => {
      executeCode(lang, code + testCode, (result) => {
        if (result) {
          res.json(result);
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch (e) {
    res.json({ error: "unable to fetch test Code" });
  }
});

app.post("/submit", (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;
  const currentUserEmail = req.body.userEmail;
  const currentPnum = req.body.pnum;

  try {
    fetchTestCode("submissionTestCode", req.body.pnum, lang, (testCode) => {
      executeCode(lang, code + testCode, async (result) => {
        if (result) {
          let submissionStatus;
          let isSolved;
          const date = new Date();
          const currentDate = date.toLocaleDateString();
          if (result.substring(0, 4) == "True") {
            submissionStatus = {
              status: "AC",
              lang,
              date: currentDate,
            };
            isSolved = true;
          } else {
            submissionStatus = {
              status: "WA",
              lang,
              date: currentDate,
            };
            isSolved = false;
          }
          const submisonInfo = {
            solved: isSolved,
            lastSubmission: code,
            submissions: [submissionStatus],
          };

          await updateUsersProgressHistory(
            currentUserEmail,
            String(currentPnum),
            submisonInfo,
            code,
            isSolved,
            submissionStatus
          );
          res.json(String(result));
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch {
    // res.json({ error: "Internal server Error" });
  }
});

app.post("/submissions", (req, res) => {
  if (!req.body.user) {
    res.json([]);
    return;
  }
  mongoose
    .model("user")
    .findOne({ userEmail: req.body.user })
    .select(`problemsReached.${req.body.pnum}`)
    .then((fetchedUser) => {
      if (
        !fetchedUser.problemsReached ||
        !fetchedUser.problemsReached.get(req.body.pnum)
      ) {
        res.json({ msg: "No submission" });
      } else {
        res.json({
          listOfSubmission: fetchedUser.problemsReached.get(req.body.pnum)
            .submissions,
        });
      }
    })
    .catch(() => res.sendStatus(404));
});
//schema
const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  problemsReached: {
    type: Map,
    of: {
      lastSubmission: String,
      solved: Boolean,
      submissions: Array,
    },
  },
});

const user = mongoose.model("user", userSchema);

app.post("/sign-up", async (req, res) => {
  userName = req.body.name;
  userEmail = req.body.email;
  userPassword = req.body.password;
  const someUser = await user.findOne({ userEmail: userEmail });
  if (someUser) {
    res.json({ errors: "Account already exists" });
    return;
  } else {
    const newUser = new user({
      userName,
      userEmail,
      userPassword,
    });
    newUser
      .save()
      .then((msg) => {
        res.json({ msg, route: "/home" });
      })
      .catch((errors) => {
        res.status(404).json({ errors });
      });
  }
});

app.post("/log-in", async (req, res) => {
  userEmail = req.body.email;
  userPassword = req.body.password;
  // user
  //   .findOne({ userEmail: userEmail })
  //   .select("userName userEmail problemsReached.$")
  //   .then((user) => {
  //     res.json(user);
  //   });
  const someUser = await user.findOne({ userEmail });

  if (someUser) {
    if (someUser._doc.userPassword == userPassword) {
      res.json({ msg: someUser._doc, route: "/home" });
      return;
    } else {
      res.json({ errors: "passwrod is wrong" });
      return;
    }
  } else {
    res.json({ errors: "Email id or passwrod is wrong" });
  }
});

async function userAuthOnGetRequest(req, res, next) {
  // console.log(req.headers.token);
  // if (!req.headers.token) {
  //   res.status("404").send({ fetchError: "Log - in required 1" });
  //   return;
  // } else {
  //   const user = await mongoose
  //     .model("user")
  //     .findOne({ userEmail: req.headers.token });
  //   if (!user) {
  //     res.status("401").send({ fetchError: "Forbidden 2" });
  //     return;
  //   } else {
  //     next();
  //   }
  // }
  next();
}
//problems
const problemSchema = new mongoose.Schema({
  pnum: Number,
  title: String,
  difficulty: String,
  description: {
    overview: String,
    examples: Array,
  },
  boilerPlate: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  testCode: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  submissionTestCode: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  testCases: Array,
});

const problem = mongoose.model("problems", problemSchema);
app.post("/admin/addProblem", (req, res) => {
  const newProblem = new problem({
    ...req.body.newProblem,
  });
  newProblem
    .save()
    .then(() => {
      console.log("New Problem Added!");
      res.json({ success: "problem added" });
    })
    .catch(() => {
      console.log("Could not Add problem!");
    });
});

app.get("/problems", userAuthOnGetRequest, (req, res) => {
  try {
    mongoose
      .model("problems")
      .find({})
      .select("pnum title difficulty")
      .then((problems) => {
        // mongoose.us
        res.json(problems);
      });
  } catch {
    console.log("error fetching problems");
  }
});

app.get("/problems/:id", userAuthOnGetRequest, (req, res) => {
  const requestedProblemTitle = req.params.id.replaceAll("-", " ");

  mongoose
    .model("problems")
    .findOne({ title: requestedProblemTitle })
    .select("-testCode -submissionTestCode")
    .then((foundp) => {
      if (!foundp) {
        res.status(404).json({ fetchError: "FAILED to FETCH" });
      } else {
        return res.json(foundp);
      }
    })
    .catch(() => {
      res.status(404).json({ fetchError: "cannot find problem" });
    });
});

app.listen(port, () => {
  console.log(`running in http://localhost:${port}`);
});
