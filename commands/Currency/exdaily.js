const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "exdaily",
  aliases: ["exd"],
  category: "currency",
  description:
    "Rturns the daily historical time series for a digital currency (e.g., BTC) traded on a specific market (e.g., CNY/Chinese Yuan), refreshed daily at midnight (UTC). Prices and volumes are quoted in both the market-specific currency and USD.",
  usage: "<currency> <market>",
  parameters: {
    "-market": "market on which the currency is traded (e.g., CNY/Chinese Yuan",
  },
  run: async (client, message, args) => {
    if (args.length != 2)
      return message.channel.send("Usage: <currency> <market>");
    else {
      var currency = args[0].toUpperCase();
      var market = args[1].toUpperCase();

      exdailyData(client, message, currency, market).then(() => {
        exdailyDisplay(client, message, currency, market);
      });
    }
  },
  exdailyData: (client, message, currency, market) => {
    return exrateData(client, message, currency, market);
  },
};

function exdailyData(client, message, currency, market) {
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
    scriptPath: "./commands/currency/",
    args: [currency, market],
  };

  const path = "exdaily.py";

  return new Promise((resolve, reject) => {
    alpha.crypto
      .daily(currency, market)
      .catch((err) => {
        // console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/currency/${currency}_${market}.json`,
          JSON.stringify(data)
        ).then(() => {
          python
            .pythonRun(path, options)
            .then(() => {
              resolve();
            })
            .catch(() => reject());
        });
      });
  });
}

function exdailyDisplay(client, message, currency, market) {
  const embed = new MessageEmbed();

  const attachment = new MessageAttachment(
    `commands/currency/${currency}_${market}.png`
  );

  embed.image = { url: `attachment://${currency}_${market}.png` };
  embed.setColor("BLUE");

  return message.channel
    .send({ files: [attachment], embed: embed })
    .then(() => {
      exdailyCleanUp(currency, market);
    });
}

function exdailyCleanUp(currency, market) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/currency/${currency}_${market}.png`, cb);
  fs.unlink(`commands/currency/${currency}_${market}.json`, cb);

}
