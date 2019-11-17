const fs = require("fs");

module.exports.getDirectories = sourcePath =>
  fs
    .readdirSync(sourcePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

module.exports.getFiles = sourcePath => {
  return fs.readdirSync(sourcePath);
};

module.exports.readFileData = filePath => {
  return fs.readFileSync(filePath);
};

module.exports.readFileDataUTF8 = filePath => {
  return fs.readFileSync(filePath, "utf-8");
};
