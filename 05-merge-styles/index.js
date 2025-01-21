const fs = require("fs");
const path = require("path");

const output = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"));

const pathToStylesDir = path.join(__dirname, "styles");
fs.readdir(pathToStylesDir, { encoding: "utf-8" }, (err, fileNames) => {
  fileNames.forEach((fileName) => fs.stat(path.join(pathToStylesDir, fileName), (err, stat) => {
    const pathToFile = path.join(pathToStylesDir, fileName);
    if (stat.isFile() && path.extname(pathToFile) === ".css") {
      const input = fs.createReadStream(pathToFile, "utf-8");
      let result = "";
      input.on("data", (data) => result += data);
      input.on("end", () => output.write(result));
    }
  }));
});