const { MessageEmbed, MessageAttachment } = require("discord.js");
const botconfig = require("../../botconfig.json");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");

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
  const embed = new MessageEmbed();

  let db = admin.firestore().collection("user_portfolios").doc(author.id);

  db.get().then((doc) => {
    if (!doc.exists) {
      return message.channel.send(`<@${author.id}> has an empty portfolio!`);
    } else {
      for (var key in doc.data().tickers) {
        embed.addField("Stock: ", doc.data().tickers[key].toUpperCase(), true);
      }
      embed.setAuthor(`${author.username}'s Portfolio`);
      embed.setColor("GREEN");

      return message.channel.send({ embed: embed });
    }
  });
}
