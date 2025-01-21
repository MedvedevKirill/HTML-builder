const fs = require('fs');
const path = require('path');
const { stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, "text.txt"));
console.log("\nHello!\n");
console.log("Enter your text below: ");

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on("SIGINT", () => process.exit());
process.on("exit", () => console.log("\nGood luck!"));