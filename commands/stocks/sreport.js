const { MessageAttachment } = require("discord.js");
const fs = require("fs");

const quoteData = require("./quote.js");
const intraData = require("./intraday.js");
const monthData = require("./monthly.js");

const python = require("../../pythonRun.js");

module.exports = {
  name: "sreport",
  aliases: ["srpt"],
  category: "stocks",
  description: "Returns the aggregate analysis data for a stock.",
  usage: "<ticker>",
  run: async (client, message, args) => {
    if (args.length != 1) return message.channel.send("Usage: <ticker>");
    else {
      var ticker = args[0].toLowerCase();

      reportData(client, message, ticker).then(() => {
        displayReport(client, message, ticker);
      });
    }
  },
};

async function reportData(client, message, input) {
  const ticker = input.toLowerCase();

  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/stocks/",
    args: [ticker],
  };

  var path = "sreport.py";

  await intraData.intradayData(client, message, ticker);
  await monthData.monthlyData(client, message, ticker);
  await quoteData.quoteData(client, message, ticker);

  return new Promise((resolve, reject) => {
    python
      .pythonRun(path, options)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

function displayReport(client, message, ticker) {
  const attachment = new MessageAttachment(
    `./commands/stocks/${ticker}_report.docx`
  );

  return message.channel.send({ files: [attachment] }).then(() => {
    cleanUp(ticker);
  });
}

function cleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`./commands/stocks/${ticker}_report.docx`, cb);
  intraData.intradayCleanUp(ticker);
  monthData.monthlyCleanUp(ticker);
  quoteData.quoteCleanUp(ticker);
}
