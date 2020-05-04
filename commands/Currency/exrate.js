const { embedSend, alpha, styles } = require("../../shared/shared.js");

var returnedData;

module.exports = {
  name: "exrate",
  aliases: ["exr"],
  category: "currency",
  description:
    "Returns the realtime exchange rate for any pair of digital currency (e.g., BTC) and physical currency (e.g., USD)",
  usage: "t.exrate <from_currency> <to_currency>",
  run: async (client, message, args, author) => {
    if (args.length != 2)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var from_currency = args[0].toUpperCase();
      var to_currency = args[1].toUpperCase();

      exrateData(client, message, from_currency, to_currency)
        .then(() => {
          exrateDisplay(
            client,
            message,
            from_currency,
            to_currency,
            returnedData,
            author
          );
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
  exrateData: (client, message, from_currency, to_currency) => {
    return exrateData(client, message, from_currency, to_currency);
  },
};

function exrateData(client, message, from_currency, to_currency) {
  return new Promise((resolve, reject) => {
    alpha.forex
      .rate(from_currency, to_currency)
      .then((data) => {
        returnedData = JSON.stringify(data);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function exrateDisplay(
  client,
  message,
  from_currency,
  to_currency,
  data,
  author
) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  var obj = JSON.parse(data)["Realtime Currency Exchange Rate"];

  embed.setAuthor(`${from_currency} to ${to_currency}`);

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      embed.addField(key.slice(3), obj[key], true);
    }
  }

  return message.channel.send(`<@${author.id}>, ${style["embed_msg"]}.`, {
    embed: embed,
  });
}
