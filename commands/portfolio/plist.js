const { embedSend, admin, styles } = require("../../shared/shared.js");

module.exports = {
  name: "plist",
  aliases: ["pli"],
  category: "portfolio",
  description: "Lists the stock from the user's portfolio.",
  usage: "t.plist",
  run: async (client, message, args, author) => {
    plistData(client, message, args, author);
  },
};

function plistData(client, message, ticker, author) {
  const style = styles[module.exports.category];
  const embed = embedSend(style["embed_color"]);

  let db = admin.firestore().collection("user_portfolios").doc(author.id);

  db.get().then((doc) => {
    if (!doc.exists) {
      return message.channel.send(`<@${author.id}> does not have a portfolio. Create one with t.padd <ticker>`);
    } else {
      for (var key in doc.data().tickers) {
        embed.addField("Stock: ", doc.data().tickers[key].toUpperCase(), true);
      }
      embed.setAuthor(`${author.username}'s Portfolio`);

      return message.channel.send({ embed: embed });
    }
  });
}
