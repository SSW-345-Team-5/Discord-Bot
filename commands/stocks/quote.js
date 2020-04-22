const {
  embedSend,
  writeFilePromise,
  alpha,
  fs,
  styles,
} = require("../../shared/shared.js");

var returnedData;

module.exports = {
  name: "quote",
  aliases: ["qu"],
  category: "stocks",
  description:
    "Returns quote (A lightweight alternative to the time series APIs, this service returns the latest price and volume information for a security of your choice.)",
  usage: "<ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();

      quoteData(client, message, ticker)
        .then(() => {
          quoteDisplay(client, message, ticker, returnedData, author);
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
  quoteData: (client, message, ticker) => {
    return quoteData(client, message, ticker);
  },
  quoteCleanUp: (ticker) => {
    return quoteCleanUp(ticker);
  },
};

function quoteData(client, message, ticker) {
  return new Promise((resolve, reject) => {
    alpha.data
      .quote(ticker)
      .then((data) => {
        writeFilePromise(
          `commands/stocks/${ticker}_quote.json`,
          JSON.stringify(data)
        )
          .then(() => {
            returnedData = JSON.stringify(data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function quoteDisplay(client, message, ticker, data, author) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  var obj = JSON.parse(data)["Global Quote"];

  embed.setAuthor(ticker.toUpperCase());

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && key !== "01. symbol") {
      embed.addField(key.slice(3), obj[key], true);
    }
  }

  return message.channel.send({ embed: embed }).then(() => {
    quoteCleanUp(ticker);
  });
}

function quoteCleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/stocks/${ticker}_quote.json`, cb);
}
