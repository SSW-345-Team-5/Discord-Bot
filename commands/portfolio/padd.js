const { MessageEmbed, MessageAttachment } = require("discord.js");
const botconfig = require("../../botconfig.json");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");

module.exports = {
  name: "padd",
  aliases: ["pa"],
  category: "portfolio",
  description: "Adds a stock to the user's portfolio.",
  usage: "<ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1) return message.channel.send("Usage: <ticker>");
    else {
      var ticker = args[0].toLowerCase();
      console.log(author);
      padd(client, message, ticker, author);
    }
  },
};

function padd(client, message, ticker, author) {
  let db = admin.firestore().collection("user_portfolios").doc(author.id);

  db.set(
    {
      tickers: admin.firestore.FieldValue.arrayUnion(ticker),
    },
    { merge: true }
  );

  message.channel.send(
    `<@${author.id}> added ${ticker.toUpperCase()} to their portfolio.`
  );
}
