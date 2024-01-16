const { spawn } = require("child_process"); //spawning a separate process to execute code
const { createFileOfCode } = require("./fileHandler");
const {
  pythonFilePath,
  javaFilePath,
  cFilePath,
  cExeFilePath,
  cppFilePath,
  cppExeFilePath,
} = require("./FilePaths");

function getResults(childProcess, callback) {
  // Executing Machine Code
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

function getResultOfexe(childProcess, exeFilePath, callback) {
  // EXE File execution for C and C++
  let result = "";
  childProcess.stdout.on("data", (data) => {
    result += data;
  });

  childProcess.stderr.on("data", (err) => {
    if (err) result += err;
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      const runEXE = spawn(exeFilePath, []);
      getResults(runEXE, (ret) => {
        callback(ret);
      });
    } else {
      callback(result);
    }
  });
}

function handleCode(lang, code, callback) {
  createFileOfCode(lang, code, () => {
    if (lang == "python") {
      // [Python (PVM)] -> execute
      const pythonProcess = spawn("python", [pythonFilePath]);
      getResults(pythonProcess, (ret) => {
        callback(ret);
      });
    } else if (lang == "java") {
      // [javac] -> bytecode -> [java (JVM)] -> Machine Code / execute
      const javaProcess = spawn("javac", [javaFilePath]);

      let compileError = "";

      javaProcess.stdout.on("data", (data) => {
        compileError += data;
      });

      javaProcess.stderr.on("data", (data) => {
        compileError += data;
      });
      javaProcess.on("close", (code) => {
        if (code == 0) {
          const runProcess = spawn("java", [javaFilePath]);
          getResults(runProcess, (ret) => {
            callback(ret);
          });
        } else {
          callback(compileError);
        }
      });
    } else if (lang == "c") {
      // [GCC] -> exeCode -> executed
      const cCompileProcess = spawn("gcc", [cFilePath, "-o", cExeFilePath]);
      getResultOfexe(cCompileProcess, cExeFilePath, (ret) => {
        callback(ret);
      });
    } else if (lang == "cpp") {
      // [G++] -> exeCode -> executed

      const cppCompileProcess = spawn("g++", [
        cppFilePath,
        "-o",
        cppExeFilePath,
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

module.exports = { handleCode };
