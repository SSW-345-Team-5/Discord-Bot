const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("./../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "intraday",
  description:
    "Returns graphs of the stock's intraday data over the previous hundered 15-minute intervals. Data includes high, low, opening and closing prices.",
  usage: "<ticker>",
  run: async (client, message, args) => {
    if (args.length < 1)
      return message.channel.send("Usage: <ticker> <time_interval>...");
    else {
      var ticker = args[0].toLowerCase();

      intradayData(message, ticker).then(() => {
        intradayDisplay(client, message, ticker);
      });
    }
  },
  intradayData: (message, ticker) => {
    return intradayData(message, ticker);
  },
  intradayCleanUp: ticker => {
    return intradayCleanUp(ticker);
  }
};

function intradayData(message, ticker) {
  const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, error => {
        if (error) reject(error);
        resolve();
      });
    });
  };

  var options = {
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./commands/intraday/",
    args: ticker
  };

  const path = "chart.py";

  return new Promise((resolve, reject) => {
    alpha.data
      .intraday(ticker, "15min")
      .catch(() => {
        stockErr.stockNotFound(message, ticker);
      })
      .then(data => {
        writeFilePromise(
          `commands/intraday/${ticker}.json`,
          JSON.stringify(data)
        ).then(() => {
          python
            .pythonRun(path, options)
            .then(() => resolve())
            .catch(() => reject());
        });
      });
  });
}

function intradayDisplay(client, message, ticker) {
  const embed = new MessageEmbed();

  const attachment = new MessageAttachment(`commands/intraday/${ticker}.png`);

  embed.image = { url: `attachment://${ticker}.png` };
  embed.setColor("BLUE");

  return message.channel
    .send({ files: [attachment], embed: embed })
    .then(() => {
      intradayCleanUp(ticker);
    });
}

function intradayCleanUp(ticker) {
  const cb = function(err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/intraday/${ticker}.json`, cb);
  fs.unlink(`commands/intraday/${ticker}.png`, cb);
}
