const fs = require("fs");
const readline = require("readline");

for (var i = 2; i < process.argv.length; ++i) {
  var fileName = process.argv[i];

  var lineReader = readline.createInterface({
    input: fs.createReadStream(fileName)
  })

  var lineCount = 0;
  lineReader.on("line", function(line) {
    console.log((lineCount == 0 ? '[' : ',') + '"' + line.replace(/"/g, '\\"') + '"')
    ++lineCount;
  })
  lineReader.on("close", function(line) {
    console.log("]")
  })
}
