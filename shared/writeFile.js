const fs = require("fs");

module.exports = {
  writeFilePromise: (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  },
};
