const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const { log } = require("console");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/web-project-db");
app.use(bodyParser.json());
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
    // console.log(result);
    callback(result);
  });
}

function getResultOfexe(childProcess, exec, callback) {
  let result = "";
  childProcess.stdout.on("data", (data) => {
    result += data;
  });

  childProcess.stderr.on("data", (err) => {
    if (err) {
      result += err;
      return callback(result);
    }
  });
  console.log(exec);
  childProcess.on("close", (code) => {
    const runEXE = spawn("./" + exec, []);
    runEXE.stdout.on("data", (data) => {
      result += data;
    });
    runEXE.stderr.on("data", (data) => {
      result += data;
    });
    runEXE.on("close", (data) => {
      callback(result);
    });
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
      const javaProcess = spawn("java", ["userProgramFiles/testJava.java"]);
      getResults(javaProcess, (ret) => {
        callback(ret);
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

app.post("/run", (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;
  executeCode(lang, code, (result) => {
    res.json(result);
  });
});

const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
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
        res.json({ msg });
      })
      .catch((errors) => {
        res.json({ errors });
      });
  }
});

app.post("/log-in", async (req, res) => {
  userEmail = req.body.email;
  userPassword = req.body.password;
  const someUser = await user.findOne({ userEmail: userEmail });

  if (someUser) {
    if (someUser._doc.userPassword == userPassword) {
      res.json({ msg: someUser._doc });
      return;
    } else {
      res.json({ errors: "passwrod is wrong" });
      return;
    }
  } else {
    res.json({ errors: "Email id or passwrod is wrong" });
  }
});

//problems
const problems = [
  {
    pnum: 1,
    title: "Sum of two Integers",
    difficulty: "easy",
    discription:
      "Complete the solveMeFirst function in the editor below.\nsolveMeFirst has the following parameters:\nint a: the first value\nint b: the second value",
    boilerPlate: {
      python: "def addTwoNumers(num1, num2):\n",
      java: "import java.util.*;\nclass addNumbers{\npublic int add(int num1,int num2){\n\n}\n}\n",
      c: "#include <stdio.h>\nint add(num1, num2){\n\n}",
      cpp: "",
    },
    testCases: [
      [1, 2],
      [3, 4],
      [5, -2],
    ],
  },
  {
    pnum: 2,
    title: "Sum of three Integers",
    difficulty: "medium",
    discription:
      "Complete the solveMeFirst function in the editor below.\nsolveMeFirst has the following parameters:\nint a: the first value\nint b: the second value",
    boilerPlate: {
      python: "def addTwoNumers(num1, num2):\n",
      java: "import java.util.*;\nclass addNumbers{\npublic int add(int num1,int num2){\n\n}\n}\n",
      c: "#include <stdio.h>\nint add(num1, num2){\n\n}",
      cpp: "",
    },
    testCases: ["1  2", "3  4", "5  -2"],
  },
  {
    pnum: 3,
    title: "Sum of four Integers",
    difficulty: "hard",
    discription:
      "Complete the solveMeFirst function in the editor below.\nsolveMeFirst has the following parameters:\nint a: the first value\nint b: the second value",
    boilerPlate: {
      python: "def addTwoNumers(num1, num2):\n",
      java: "import java.util.*;\nclass addNumbers{\npublic int add(int num1,int num2){\n\n}\n}\n",
      c: "#include <stdio.h>\nint add(num1, num2){\n\n}",
      cpp: "",
    },
    testCases: ["1 2", "3 4", "5 -2"],
  },
];

app.get("/problems", (req, res) => {
  res.json({ problems });
});

app.get("/problems/:id", (req, res) => {
  const requestedProblemTitle = req.params.id.replaceAll("-", " ");
  const foundp = problems.find((p) => p.title == requestedProblemTitle);

  if (foundp) {
    return res.json({ problemInfo: foundp });
  } else {
    return res.json("cannot find problem");
  }
});

app.listen(port, () => {
  console.log(`running in http://localhost:${port}`);
});
