const { MessageEmbed, MessageAttachment } = require("discord.js");
const botconfig = require("../../botconfig.json");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");
const { reportData, reportDisplay, cleanUp } = require("../stocks/sreport.js");

module.exports = {
  name: "preport",
  aliases: ["prpt"],
  category: "portfolio",
  description:
    "Generates a stock report for every stock in the user's portfolio.",
  usage: "t.preport",
  run: async (client, message, args, author) => {
    preportData(client, message, args, author);
  },
};

function preportData(client, message, args, author) {
  let db = admin.firestore().collection("user_portfolios").doc(author.id);

  db.get().then((doc) => {
    var tickers = doc.data().tickers;

    if (!doc.exists || tickers.length == 0) {
      return message.channel.send(`<@${author.id}> has an empty portfolio!`);
    } else {
      for (var key in tickers) {
        let ticker = tickers[key];
        reportData(client, message, ticker).then(() => {
          const attachment = new MessageAttachment(
            `./commands/stocks/${ticker}_sreport.docx`
          );
          return message.channel.send({ files: [attachment] }).then(() => {
            cleanUp(ticker);
          });
        });
      }
    }
  });
}
