const fs = require('fs');
const filePath = process.argv[2];
fs.readdir(filePath, function (err, files) {
  if (err) {
    return console.error(err);
  }
    console.log(files.filter(file => file.endsWith('.' + process.argv[3])).join('\n'));
  });