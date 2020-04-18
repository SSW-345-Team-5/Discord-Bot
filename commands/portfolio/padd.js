const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

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
    }
  },
};
