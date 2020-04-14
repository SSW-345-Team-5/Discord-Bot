const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");

const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

var returnedData;

module.exports = {
  name: "quote",
  aliases: ["qu"],
  category: "stocks",
  description:
    "Returns quote (A lightweight alternative to the time series APIs, this service returns the latest price and volume information for a security of your choice.)",
  usage: "<ticker>",
  run: async (client, message, args) => {
    if (args.length != 1) return message.channel.send("Usage: <ticker>");
    else {
      var ticker = args[0].toLowerCase();

      quoteData(client, message, ticker).then(() => {
        quoteDisplay(client, message, ticker, returnedData);
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
  const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  };

  return new Promise((resolve, reject) => {
    alpha.data
      .quote(ticker)
      .catch(() => {
        stockErr.stockNotFound(client, message, ticker);
      })
      .then((data) => {
        writeFilePromise(`commands/stocks/${ticker}_quote.json`, JSON.stringify(data))
          .then(() => {
            returnedData = JSON.stringify(data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

function quoteDisplay(client, message, ticker, data) {
  const embed = new MessageEmbed();
  var obj = JSON.parse(data)["Global Quote"];

  embed.setColor("GREEN");

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
