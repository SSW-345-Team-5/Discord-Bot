const { admin } = require("../../shared/shared.js");

module.exports = {
  name: "premove",
  aliases: ["prm"],
  category: "portfolio",
  description: "Removes a stock from the user's portfolio.",
  usage: "t.premove <ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1)
      return message.channel.send(`Usage: ${modules.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();
      premove(client, message, ticker, author);
    }
  },
};

function premove(client, message, ticker, author) {
  let db = admin.firestore().collection("user_portfolios").doc(author.id);

  db.set(
    {
      tickers: admin.firestore.FieldValue.arrayRemove(ticker),
    },
    { merge: true }
  );

  message.channel.send(
    `<@${author.id}> removed ${ticker.toUpperCase()} from their portfolio.`
  );
}
