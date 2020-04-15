const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

var returnedData;

module.exports = {
  name: "exrate",
  aliases: ["exr"],
  category: "Currency",
  description:
    "Returns the realtime exchange rate for any pair of digital currency (e.g., Bitcoin) and physical currency (e.g., USD)",
  usage: "<from_currency> <to_currency>",
  run: async (client, message, args) => {
    if (args.length != 2)
      return message.channel.send("Usage: <from_currency> <to_currency>");
    else {
      var from_currency = args[0].toUpperCase();
      var to_currency = args[1].toUpperCase();

      exrateData(client, message, from_currency, to_currency).then(() => {
        exrateDisplay(
          client,
          message,
          from_currency,
          to_currency,
          returnedData
        );
      });
    }
  },
  exrateData: (client, message, from_currency, to_currency) => {
    return exrateData(client, message, from_currency, to_currency);
  },
};

function exrateData(client, message, from_currency, to_currency) {
  return new Promise((resolve, reject) => {
    alpha.forex
      .rate(from_currency, to_currency)
      .catch(() => {
        // stockErr.stockNotFound(client, message);
      })
      .then((data) => {
        returnedData = JSON.stringify(data);
        resolve();
      })

      .catch(() => {
        reject();
      });
  });
}

function exrateDisplay(client, message, from_currency, to_currency, data) {
  const embed = new MessageEmbed();
  var obj = JSON.parse(data)["Realtime Currency Exchange Rate"];

  embed.setColor("GREEN");

  embed.setAuthor(`${from_currency} to ${to_currency}`);

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      embed.addField(key.slice(3), obj[key], true);
    }
  }

  return message.channel.send({ embed: embed });
}
