const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("python-shell");

const botconfig = require("./../../botconfig.json");
const key = botconfig.alphavantage_key;

const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "intraday",
  description:
    "Returns a graph for each of the input data fields over the selected intraday data",
  usage: "[ticker] [time_interval] [data_1] <data_2>...",
  parameters: {
    time_interval: "1/5/15/30/60 (minutes between samples)",
    data_fields: "open/high/low/close/volume"
  },
  run: async (client, message, args) => {
    if (args.length < 1)
      return message.channel.send(
        "Usage: [ticker] [time_interval] [data_1] <data_2>..."
      );
    else {
      var ticker = args[0].toLowerCase();

      intradayData(ticker).then(() => {
        intradayDisplay(client, message, ticker);
      });
    }
  },
  intradayData: (ticker) => {
    return intradayData(ticker);
  } 
};

function intradayData(ticker) {
  const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, error => {
        if (error) reject(error);
        resolve();
      });
    });
  };

  return new Promise((resolve, reject) => {
    alpha.data.intraday(ticker).then(data => {
      writeFilePromise(
        `commands/intraday/${ticker}.json`,
        JSON.stringify(data)
      ).then(() => {
        var options = {
          pythonOptions: ["-u"], // get print results in real-time
          scriptPath: "./commands/intraday/",
          args: ticker
        };
        let py = new python.PythonShell("chart.py", options);

        py.end(function(err) {
          if (err) reject();
          else resolve();
        });
      });
    });
  });
}

function intradayDisplay(client, message, ticker) {
  console.log("ok");
  const embed = new MessageEmbed();

  const attachment = new MessageAttachment(`commands/intraday/${ticker}.png`);

  embed.image = { url: `attachment://${ticker}.png` };
  embed.setColor("BLUE");

  return message.channel
    .send({ files: [attachment], embed: embed })
    .then(() => {
      cleanUp(ticker);
    });
}

function cleanUp(ticker) {
  const cb = function(err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/intraday/${ticker}.json`, cb);
  fs.unlink(`commands/intraday/${ticker}.png`, cb);
}
