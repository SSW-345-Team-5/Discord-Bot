const { admin } = require("../../shared/shared.js");

module.exports = {
  name: "padd",
  aliases: ["pa"],
  category: "portfolio",
  description: "Adds a stock to the user's portfolio.",
  usage: "t.padd <ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1) return message.channel.send(`Usage: ${ticker}`);
    else {
      var ticker = args[0].toLowerCase();
      padd(client, message, ticker, author).catch((err) => {
        return message.channel.send(err);
      });
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

  return message.channel.send(
    `<@${author.id}> added ${ticker.toUpperCase()} to their portfolio.`
  );
}
