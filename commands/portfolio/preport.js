const {
  MessageAttachment,
  embedSend,
  admin,
  styles,
} = require("../../shared/shared.js");

const { reportData, reportDisplay, cleanUp } = require("../stocks/sreport.js");

module.exports = {
  name: "preport",
  aliases: ["prpt"],
  category: "portfolio",
  description:
    "Generates a stock report for every stock in the user's portfolio. *NOTE: this cmd uses the max amount of API calls per minute. Please wait sometime in between using this and other commands. This command will not work with a portfolio size greater than 1.*",
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
      let ticker = tickers[0];
      message.channel.send(
        "The current API limit supports only enough calls for 1 stock's report generation at a time. Therefore this command will only work on the first stock in a portfolio. We apologize for any inconvenience."
      );
      reportData(client, message, ticker).then(() => {
        reportDisplay(client, message, ticker, author);
      });
    }
  });
}
