const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://pawannaik396:web-project@cluster0.dpuzv08.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI);
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
      runEXE.stdout.on("data", (data) => {
        result += data;
      });
      runEXE.stderr.on("data", (err) => {
        result += err;
      });
      runEXE.on("close", (code) => {
        return callback(result);
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
  const testCode = problems["1"].testCode[lang];

  executeCode(lang, code + testCode, (result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

//schema
const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
});

// const problemSetSchema = new mongoose.Schema({});
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
const problems = {
  1: {
    pnum: 1,
    title: "Sum of two Integers",
    difficulty: "easy",
    description: `Complete the solveMeFirst function in the editor below.
      nsolveMeFirst has the following parameters:
      nint a: the first value
      int b: the second value`,
    boilerPlate: {
      python: `def addTwoNumers(num1, num2):
    `,
      java: `import java.util.*;
class addNumbers{
    public static int add(int num1,int num2){
  
    }
}`,
      c: `#include <stdio.h>
int add(int num1,int num2){

}`,
      cpp: "",
    },
    testCode: {
      python: `
testCases = [[1, 2],[3, 4], [5, -2]]
n = len(testCases)
expected = [3, 7, 3]
for i in range(n):
    res = addTwoNumers(testCases[i][0],testCases[i][1])
    if res != expected[i]:
        print("INPUT: ",testCases[i][0],",", testCases[i][1])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print(True)`,
      java: `
      public class testJava {

    public void testCode(){
        int[][] TestCases = {{1,2},{3,4},{5,-2}};
        int[] expected = {3, 7, 3};
        addNumbers myobj = new addNumbers();
        for(int i=0;i<TestCases.length;i++){
            int res = myobj.add(TestCases[i][0],TestCases[i][1]);
            if(res != expected[i]){
                System.out.println("CASE: "+TestCases[i][0]+", "+TestCases[i][1]);
                System.out.println("EXPECTED: "+expected[i]);
                System.out.println("RESULT: "+res);
                System.exit(0);
            }
        }
        System.out.println("true");
    }
    public static void main(String args[]){
        testJava t=new testJava();
        t.testCode();
    }
}`,
      c: `
      int main()
{
    int testCases[3][2] = {{1, 2},{3, 4},{5, -2}};
    int expected[3] = {3, 7, 3};
    for(int i=0;i<3;i++)
    {
        int res = add(testCases[i][0],testCases[i][1]);
        if(res != expected[i])
        {
            printf("INPUT: %d, %d",testCases[i][0], testCases[i][1]);
            printf("  EXPECTED: %d",expected[i]);
            printf("  RESULT: %d",res);
            return 0;
        }
    }
      printf("true");
}`,
    },
    testCases: [
      [1, 2],
      [3, 4],
      [5, -2],
    ],
  },
  2: {
    pnum: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    description: `Complete the solveMeFirst function in the editor below.

Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.`,
    boilerPlate: {
      python: `def longestSubstring(s):
    `,
      java: "import java.util.*;\nclass addNumbers{\npublic int add(int num1,int num2){\n\n}\n}\n",
      c: "#include <stdio.h>\nint add(num1, num2){\n\n}",
      cpp: "",
    },
    testCode: {
      python: `
testCases = ["abcabcbb", "bbbbb", "pwwkew"]
expected = [3,1,3]
for i in range(len(testCases)):
    res = longestSubstring(testCases[i])
    if res != expected[i]:
        print("INPUT: ",testCases[i])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print("true")`,
      java: ``,
      c: ``,
      cpp: ``,
    },
    testCases: ["abcabcbb", "bbbbb", "pwwkew"],
  },
  3: {
    pnum: 2,
    title: "Sum of three Integers",
    difficulty: "medium",
    description: `Complete the solveMeFirst function in the editor below.
      nsolveMeFirst has the following parameters:
      nint a: the first value
      int b: the second value`,
    boilerPlate: {
      python: `def addTwoNumers(num1, num2):
      `,
      java: `import java.util.*;
      class addNumbers{
        public int add(int num1,int num2){

        }
      }
      `,
      c: `#include <stdio.h>
      int add(num1, num2){
      
      }
      `,
      cpp: "",
    },
    testCases: [
      [1, 2],
      [3, 4],
      [5, -2],
    ],
  },
  4: {
    pnum: 3,
    title: "Sum of four Integers",
    difficulty: "hard",
    description:
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
};

app.get("/problems", (req, res) => {
  res.json({ problems });
});

app.get("/problems/:id", (req, res) => {
  const requestedProblemTitle = req.params.id.replaceAll("-", " ");
  // const foundp = problems.find((p) => p.title == requestedProblemTitle);

  const foundp = Object.values(problems).find(
    (p) => p.title == requestedProblemTitle
  );
  if (foundp) {
    return res.json({ problemInfo: foundp });
  } else {
    return res.json("cannot find problem");
  }
});

app.listen(port, () => {
  console.log(`running in http://localhost:${port}`);
});
