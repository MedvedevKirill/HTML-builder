const fs = require("fs");
const path = require("path");

const pathToDir = path.join(__dirname, "secret-folder");
fs.readdir(pathToDir, { encoding: "utf-8" }, (err, fileNames) => {
  fileNames.forEach(fileName => {
    const pathToFile = path.join(pathToDir, fileName);
    fs.stat(pathToFile, (err, stat) => {
      if (stat.isFile()) {
        const ext = path.extname(pathToFile);
        console.log(`${fileName.replace(ext, "")} - ${ext.replace(".", "")} - ${(stat.size / 1024).toFixed(3)}kb`);
      }
    });
  });
});
