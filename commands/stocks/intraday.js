const MessageEmbed = require("discord.js");
const fs = require("fs");

const botconfig = require("./../../botconfig.json");
const key = botconfig.alphavantage_key;

const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "stocks",
  description: "Returns the intraday data for the particular ticker",
  usage: "[ticker]",
  run: async (client, message, args) => {
    if (args.length < 1) return message.reply("Enter a valid ticker.");
    else return intradayData(client, message, args[0]);
  }
};

function intradayData(client, message, input) {
  // const embed = new MessageEmbed();

  const ticker = input.toLowerCase();

  alpha.data.intraday(ticker).then(data => {
    fs.writeFile(`commands/stocks/intraday_data/${ticker}.json`, JSON.stringify(data), err => {
      if (err) {
        console.log(err);
        return;
      } else console.log("File created.");
    });
  });

  // return message.channel.send(embed.setColor("BLUE").setDescription(info.toString()));
}
