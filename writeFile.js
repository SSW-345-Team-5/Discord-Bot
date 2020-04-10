const fs = require("fs");

const write = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

module.exports.write = write;