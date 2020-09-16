const fs = require("fs");

//
// Read a text file and write to the console a JSON array, the elements of which are
// the lines of the text file.
//
function formatAsJsonList(fileName) {
  const text = fs.readFileSync(fileName, "utf-8")
  const lines = text.split("\n")

  var buf = "[";
  for (var lineCount = 0; lineCount < lines.length; ++lineCount) {
    const line = lines[lineCount];
    buf += (lineCount == 0 ? '' : ',') + '"' + line.replace(/"/g, '\\"') + '"';
  }
  buf += "]";

  return buf;
}

module.exports = {
  formatAsJsonList
}
