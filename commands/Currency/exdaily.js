const {
  MessageAttachment,
  embedSend,
  writeFilePromise,
  pythonRun,
  alpha,
  fs,
  styles
} = require("../../shared/shared.js");

module.exports = {
  name: "exdaily",
  aliases: ["exd"],
  category: "currency",
  description:
    "Returns the daily historical time series for a digital currency (e.g., BTC) traded on a specific market (e.g., CNY/Chinese Yuan), refreshed daily at midnight (UTC). Prices and volumes are quoted in both the market-specific currency and USD.",
  usage: "t.exdaily <currency> <market>",
  parameters: {
    "-market":
      "market on which the currency is traded (e.g., CNY/Chinese Yuan)",
  },
  run: async (client, message, args, author) => {
    if (args.length != 2)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var currency = args[0].toUpperCase();
      var market = args[1].toUpperCase();

      exdailyData(client, message, currency, market)
        .then(() => {
          exdailyDisplay(client, message, currency, market, author);
        })
        .catch((err) => {
          return message.channel.send(
            JSON.parse(err.split("An AlphaVantage error occurred. ")[1])[
              "Error Message"
            ]
          );
        });
    }
  },
  exdailyData: (client, message, currency, market) => {
    return exdailyData(client, message, currency, market);
  },
};

function exdailyData(client, message, currency, market) {
  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/currency/",
    args: [currency, market],
  };

  const path = "exdaily.py";

  return new Promise((resolve, reject) => {
    alpha.crypto
      .daily(currency, market)
      .then((data) => {
        writeFilePromise(
          `commands/currency/${currency}_${market}.json`,
          JSON.stringify(data)
        ).then(() => {
          pythonRun(path, options)
            .then(() => {
              resolve();
            })
            .catch(() => reject());
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function exdailyDisplay(client, message, currency, market, author) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  const attachment = new MessageAttachment(
    `commands/currency/${currency}_${market}.png`
  );

  embed.image = { url: `attachment://${currency}_${market}.png` };

  return message.channel
    .send(`<@${author.id}>, ${style["embed_msg"]}.`,{ files: [attachment], embed: embed })
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
