const fs = require("fs");
const path = require("path");
const pathToDir = path.join(__dirname, "project-dist");

fs.mkdir(pathToDir, { recursive: true }, (err) => {
  createHTML();
  createStyle();
  createAssets();
});

function createHTML() {
  const templateInput = fs.createReadStream(path.join(__dirname, "template.html"), "utf-8");
  const output = fs.createWriteStream(path.join(pathToDir, "index.html"));
  let htmlStr = "";

  templateInput.on("data", (data) => htmlStr += data);
  templateInput.on("end", () => {
    const pathToComponentsDir = path.join(__dirname, "components");
    fs.readdir(pathToComponentsDir, { encoding: "utf-8", withFileTypes: true}, (err, fileNames) => {
      const filteredFiles = fileNames.filter((file) => file.isFile() && path.extname(path.join(pathToComponentsDir, file.name)) === ".html");
      let counter = filteredFiles.length;
      if (filteredFiles.length > 0) {
        filteredFiles.forEach((file) => {
          const fileName = file.name;
          const pathToFile = path.join(pathToComponentsDir, fileName);
          fs.readFile(pathToFile, (err, data) => {
            const tag = fileName.replace(".html", "");
            htmlStr = htmlStr.replaceAll(`{{${tag}}}`, data);
            counter -= 1;
            if (counter === 0) {
              output.write(htmlStr);
            }
          });
        });
      } else {
        output.write(htmlStr);
      }
    });
  });
};

function createStyle() {
  const output = fs.createWriteStream(path.join(pathToDir, "style.css"));
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
}

function createAssets(src, dist) {
  const pathToOldDir = path.join(__dirname, "assets");
  const pathToNewDir = path.join(pathToDir, "assets");

  fs.rm(pathToNewDir, { recursive: true, force: true }, (err) => {
    fs.mkdir(pathToNewDir, { recursive: true }, (err) => {
      fs.readdir(pathToOldDir, { encoding: "utf-8", withFileTypes: true }, (err, files) => {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(pathToOldDir, file.name), path.join(pathToNewDir, file.name), errorHandler);
          } else {
            copyDir(path.join(pathToOldDir, file.name), path.join(pathToNewDir, file.name));
          }
        });
      });
    });
  });

  function copyDir(src, dist) {
    fs.mkdir(dist, { recursive: true }, (err) => {
      fs.readdir(src, { encoding: "utf-8", withFileTypes: true }, (err, files) => {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(src, file.name), path.join(dist, file.name), errorHandler);
          } else {
            copyDir(path.join(src, file.name), path.join(dist, file.name));
          }
        });
      });
    });
  }

  function errorHandler(err) {
    if (err) {
      console.log(err);
    }
  }
}

