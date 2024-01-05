const path = require("path");
const baseDir = "userProgramFiles"; // where all the testCode files are located
const pythonFilePath = path.join(__dirname, baseDir, "testPython.py");
const javaFilePath = path.join(__dirname, baseDir, "testJava.java");
const cFilePath = path.join(__dirname, baseDir, "testCprogram.c");
const cExeFilePath = path.join(__dirname, baseDir, "testCprogram.exe");
const cppFilePath = path.join(__dirname, baseDir, "testCppprogram.cpp");
const cppExeFilePath = path.join(__dirname, baseDir, "testCppprogram.exe");

module.exports = {
  pythonFilePath,
  javaFilePath,
  cFilePath,
  cExeFilePath,
  cppFilePath,
  cppExeFilePath,
};
