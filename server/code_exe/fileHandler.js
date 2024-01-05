const fs = require("fs");
const {
  pythonFilePath,
  javaFilePath,
  cFilePath,
  cppFilePath,
} = require("./FilePaths");

const createFileOfCode = (lang, code, callback) => {
  try {
    if (lang == "python") {
      fs.writeFileSync(pythonFilePath, code);
    } else if (lang == "java") {
      fs.writeFileSync(javaFilePath, code);
    } else if (lang == "c") {
      fs.writeFileSync(cFilePath, code);
    } else if (lang == "cpp") {
      fs.writeFileSync(cppFilePath, code);
    }
  } catch (err) {
    console.log(err);
  }
  callback();
};

module.exports = { createFileOfCode };
