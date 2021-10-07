const moment = require('moment');
const fs = require('fs');
const path = require('path');
const DATABASE_PATH = path.join(__dirname, '..', 'data.json');

function format( time, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(time).format(format);
}

function errorHandler(e) {
  console.log(e);
}

function readFile({ path = DATABASE_PATH, encoding, callback}) {
  fs.readFile(path, encoding, (err, data) => {
    if (err) errorHandler(err.message);
    callback && callback(data);
  })
}

function writeFile({ path = DATABASE_PATH, data, callback}) {
  fs.writeFile(path, data, (err) => {
    if (err) errorHandler(err.message);
    callback && callback(err);
  })
}

module.exports = {
  format,
  errorHandler,
  readFile,
  writeFile,
}