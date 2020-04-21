const python = require("python-shell");

module.exports = {
  pythonRun: (path, options) => {
    return pythonRun(path, options);
  }
};

function pythonRun(path, options) {
  return new Promise((resolve, reject) => {
    let py = new python.PythonShell(path, options);

    py.end(function(err) {
      if (err) {
        console.log(err);
        reject();
      } else resolve();
    });
  });
}
