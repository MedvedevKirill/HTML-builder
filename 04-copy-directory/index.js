const fs = require("fs");
const path = require("path");

const pathToOldDir = path.join(__dirname, "files");
const pathToNewDir = path.join(__dirname, "files-copy");

fs.mkdir(pathToNewDir, { recursive: true }, (err) => {
  if (err) {
    console.log(err.toString());
  } else {
    fs.readdir(pathToOldDir, { encoding: "utf-8" }, (err, fileNames) => {
      fs.readdir(pathToNewDir, {encoding: "utf-8"}, (err, fileNamesNewDir) => {
        fileNamesNewDir.forEach((fileName) => {
          if (!fileNames.includes(fileName)) {
            fs.rm(path.join(pathToNewDir, fileName), errorHandler);
          }
        });
      });

      fileNames.forEach(fileName => {
        fs.copyFile(path.join(pathToOldDir, fileName), path.join(pathToNewDir, fileName), errorHandler);
      });
    });
  }
});

function errorHandler(err) {
  if (err) {
    console.log(err.toString());
  }
}
