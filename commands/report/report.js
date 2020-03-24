const { MessageAttachment } = require("discord.js");
const fs = require("fs");

const intraData = require("../intraday/intraday.js");

const python = require("../../pythonRun.js");

module.exports = {
  name: "report",
  aliases: ["rpt"],
  category: "report",
  description: "Returns the aggregate analysis data for a stock",
  usage: "[ticker]",
  run: async (client, message, args) => {
    if (args.length < 1) return message.channel.send("Usage: [ticker]");
    else {
      var ticker = args[0].toLowerCase();

      reportData(message, ticker).then(() => {
        displayReport(client, message, ticker);
      });
    }
  }
};

function reportData(message, input) {
  const ticker = input.toLowerCase();

  var options = {
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./commands/report/",
    args: ticker
  };

  var path = "report.py";

  return new Promise((resolve, reject) => {
    intraData.intradayData(message, ticker).then(() => {
      python
        .pythonRun(path, options)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  });
}

function displayReport(client, message, ticker) {
  const attachment = new MessageAttachment(
    `./commands/report/${ticker}_report.docx`
  );

  return message.channel.send({ files: [attachment] }).then(() => {
    cleanUp(ticker);
  });
}

function cleanUp(ticker) {
  const cb = function(err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/report/${ticker}_report.docx`, cb);
  intraData.intradayCleanUp(ticker);
}


