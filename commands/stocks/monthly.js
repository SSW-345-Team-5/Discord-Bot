const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "monthly",
  aliases: ["mo"],
  category: "stocks",
  description:
    "Returns monthly time series (last trading day of each month, monthly open, monthly high, monthly low, monthly close, monthly volume) of the global equity specified, covering 20+ years of historical data.",
  usage: "<ticker>",
  run: async (client, message, args) => {
    if (args.length < 1) return message.channel.send("Usage: <ticker>");
    else {
      var ticker = args[0].toLowerCase();

      monthlyData(client, message, ticker).then(() => {
        monthlyDisplay(client, message, ticker);
      });
    }
  },
  monthlyData: (client, message, ticker) => {
    return monthlyData(client, message, ticker);
  },
  monthlyCleanUp: (ticker) => {
    return monthlyCleanUp(ticker);
  },
};

function monthlyData(client, message, ticker) {
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

  const path = "monthly_chart.py";

  return new Promise((resolve, reject) => {
    alpha.data
      .monthly(ticker)
      .catch(() => {
        stockErr.stockNotFound(client, message, ticker);
      })
      .then((data) => {
        writeFilePromise(`commands/stocks/${ticker}_monthly.json`, JSON.stringify(data)).then(() => {
          python
            .pythonRun(path, options)
            .then(() => resolve())
            .catch(() => reject());
        });
      });
  });
}

function monthlyDisplay(client, message, ticker) {
  const embed = new MessageEmbed();

  const attachment = new MessageAttachment(`commands/stocks/${ticker}_monthly.png`);

  embed.image = { url: `attachment://${ticker}_monthly.png` };
  embed.setColor("BLUE");

  return message.channel
    .send({ files: [attachment], embed: embed })
    .then(() => {
      monthlyCleanUp(ticker);
    });
}

function monthlyCleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/stocks/${ticker}_monthly.json`, cb);
  fs.unlink(`commands/stocks/${ticker}_monthly.png`, cb);
}
