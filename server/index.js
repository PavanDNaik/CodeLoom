require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT || 5000;
const JWT_SECRETE = process.env.JWT_SECRETE;

mongoose.connect(process.env.MONGO_SECRETE_URI);
app.use(express.json());
app.use(cors());

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
  currentUserId,
  currentPnum,
  submisonInfo,
  latestCode,
  isSolved,
  submissionStatus
) {
  await mongoose
    .model("user")
    .findById(currentUserId)
    .then((currentUser) => {
      if (!currentUser) {
        return;
      } else if (!currentUser.problemsReached) {
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

function userAuthOnPostRequest(req, res, next) {
  if (!req.headers.token) {
    return res.json({ fetchError: "Token Required!" });
  }
  try {
    const userId = jwt.verify(req.headers.token, JWT_SECRETE);
    if (!userId) {
      return res.status(401).json({ fetchError: "Invalid Token" });
    } else {
      req.body.userId = userId.user.id;
      next();
    }
  } catch {
    return res.status(401).json({ fetchError: "Invalid Token" });
  }
}

app.post("/run", userAuthOnPostRequest, (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;

  try {
    fetchTestCode("testCode", req.body.pnum, lang, (testCode) => {
      executeCode(lang, code + testCode, (result) => {
        if (result) {
          res.json({ result });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch (e) {
    res.json({ error: "unable to fetch test Code" });
  }
});

app.post("/submit", userAuthOnPostRequest, (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;
  const currentPnum = req.body.pnum;
  const currentUserId = req.body.userId;
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
            currentUserId,
            String(currentPnum),
            submisonInfo,
            code,
            isSolved,
            submissionStatus
          );
          res.json({ result });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch {
    res.json({ error: "Internal server Error" });
  }
});

app.post("/submissions", userAuthOnPostRequest, (req, res) => {
  if (!req.body.pnum) {
    res.json([]);
    return;
  }
  mongoose
    .model("user")
    .findById(req.body.userId)
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
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(userPassword, salt);
  const someUser = await user.findOne({ userEmail: userEmail });
  if (someUser) {
    res.json({ errors: "Account already exists" });
    return;
  } else {
    const newUser = new user({
      userName,
      userEmail,
      userPassword: encryptedPassword,
    });
    newUser
      .save()
      .then((someUser) => {
        const dataForJwtSign = {
          user: {
            id: someUser._id.toString(),
          },
        };
        const authToken = jwt.sign(dataForJwtSign, JWT_SECRETE);
        return res.json({
          token: authToken,
          userName: someUser.userName,
          route: "/home",
        });
      })
      .catch((errors) => {
        console.log("errors");
        res.status(404).json({ errors });
      });
  }
});

app.post("/log-in", async (req, res) => {
  userEmail = req.body.email;
  userPassword = req.body.password;
  const someUser = await user.findOne({ userEmail });
  if (someUser) {
    const pwdCompare = await bcrypt.compare(
      userPassword,
      someUser.userPassword
    );
    if (pwdCompare) {
      const dataForJwtSign = {
        user: {
          id: someUser._id,
        },
      };
      const authToken = jwt.sign(dataForJwtSign, JWT_SECRETE);
      return res.json({
        token: authToken,
        userName: someUser.userName,
        route: "/home",
      });
    } else {
      res.json({ errors: "Invalid Credentials!!" });
      return;
    }
  } else {
    res.json({ errors: "Invalid Credentials!!" });
  }
});

async function userAuthOnGetRequest(req, res, next) {
  if (!req.headers.token) {
    return res.status(401).send({ fetchError: "Token Required" });
  } else {
    try {
      const userID = jwt.verify(req.headers.token, JWT_SECRETE);
      if (!userID) {
        return res.status(401).json({ fetchError: "Invalid Token" });
      }
    } catch {
      return res.status(401).json({ fetchError: "Invalid Token" });
    }
  }

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

app.get("/problems", (req, res) => {
  try {
    mongoose
      .model("problems")
      .find({})
      .select("pnum title difficulty")
      .then((problems) => {
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
  console.log(`${BASE_URL}${port}`);
});
