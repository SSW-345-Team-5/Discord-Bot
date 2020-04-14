const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "stocks",
  description:
    "Returns intraday time series (timestamp, open, high, low, close, volume) of the equity specified.",
  usage: "<ticker>",
  run: async (client, message, args) => {
    if (args.length != 1) return message.channel.send("Usage: <ticker>");
    else {
      var ticker = args[0].toLowerCase();

      intradayData(client, message, ticker).then(() => {
        intradayDisplay(client, message, ticker);
      });
    }
  },
  intradayData: (client, message, ticker) => {
    return intradayData(client, message, ticker);
  },
  intradayCleanUp: (ticker) => {
    const output_png = `commands/stocks/${ticker}_intraday.png`;
    return intradayCleanUp(ticker);
  },
};

function intradayData(client, message, ticker) {
  const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  };

  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/stocks/",
    args: ticker,
  };

  const path = "intraday_chart.py";

  return new Promise((resolve, reject) => {
    alpha.data
      .intraday(ticker, "15min")
      .catch(() => {
        stockErr.stockNotFound(client, message, ticker);
      })
      .then((data) => {
        writeFilePromise(`commands/stocks/${ticker}_intraday.json`, JSON.stringify(data)).then(() => {
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

  const attachment = new MessageAttachment(`commands/stocks/${ticker}_intraday.png`);

  embed.image = { url: `attachment://${ticker}_intraday.png` };
  embed.setColor("BLUE");

  return message.channel
    .send({ files: [attachment], embed: embed })
    .then(() => {
      intradayCleanUp(ticker);
    });
}

function intradayCleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/stocks/${ticker}_intraday.json`, cb);
  fs.unlink(`commands/stocks/${ticker}_intraday.png`, cb);
}
