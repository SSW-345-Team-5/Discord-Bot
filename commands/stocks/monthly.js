const {
  MessageAttachment,
  writeFilePromise,
  embedSend,
  pythonRun,
  alpha,
  fs,
  styles
} = require("../../shared/shared.js");

module.exports = {
  name: "monthly",
  aliases: ["mo"],
  category: "stocks",
  description:
    "Returns the monthly time series (last trading day of each month, monthly open, monthly high, monthly low, monthly close, monthly volume) of the global equity specified, covering 20+ years of historical data.",
  usage: "t.monthly <ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();

      monthlyData(client, message, ticker)
        .then(() => {
          monthlyDisplay(client, message, ticker, author);
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
  monthlyData: (client, message, ticker) => {
    return monthlyData(client, message, ticker);
  },
  monthlyCleanUp: (ticker) => {
    return monthlyCleanUp(ticker);
  },
};

function monthlyData(client, message, ticker) {
  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/stocks/",
    args: ticker,
  };

  const path = "monthly.py";

  return new Promise((resolve, reject) => {
    alpha.data
      .monthly(ticker)
      .then((data) => {
        writeFilePromise(
          `commands/stocks/${ticker}_monthly.json`,
          JSON.stringify(data)
        ).then(() => {
          pythonRun(path, options)
            .then(() => resolve())
            .catch(() => reject());
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function monthlyDisplay(client, message, ticker, author) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  const attachment = new MessageAttachment(
    `commands/stocks/${ticker}_monthly.png`
  );

  embed.image = { url: `attachment://${ticker}_monthly.png` };

  return message.channel
    .send(`<@${author.id}>, ${style["embed_msg"]}.`, {
      files: [attachment],
      embed: embed,
    })
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
