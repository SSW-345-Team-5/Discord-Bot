const {
  MessageAttachment,
  embedSend,
  writeFilePromise,
  pythonRun,
  alpha,
  fs,
  styles,
} = require("../../shared/shared.js");

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "stocks",
  description:
    "Returns the intraday time series (timestamp, open, high, low, close, volume) of the equity specified.",
  usage: "t.intraday <ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();

      intradayData(client, message, ticker)
        .then(() => {
          intradayDisplay(client, message, ticker, author);
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
  intradayData: (client, message, ticker) => {
    return intradayData(client, message, ticker);
  },
  intradayCleanUp: (ticker) => {
    return intradayCleanUp(ticker);
  },
};

function intradayData(client, message, ticker) {
  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/stocks/",
    args: ticker,
  };

  const path = "intraday.py";

  return new Promise((resolve, reject) => {
    alpha.data
      .intraday(ticker, "15min")
      .then((data) => {
        writeFilePromise(
          `commands/stocks/${ticker}_intraday.json`,
          JSON.stringify(data)
        ).then(() => {
          pythonRun(path, options)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function intradayDisplay(client, message, ticker, author) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  const attachment = new MessageAttachment(
    `commands/stocks/${ticker}_intraday.png`
  );

  embed.image = { url: `attachment://${ticker}_intraday.png` };

  return message.channel
    .send(`<@${author.id}>, ${style["embed_msg"]}.`, {
      files: [attachment],
      embed: embed,
    })
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
