const { MessageEmbed } = require("discord.js");

module.exports = {
  embedSend: (color) => {
    return new MessageEmbed()
      .setAuthor(
        "TrendEase Trading",
        "https://i.imgur.com/gV0t2Sz.png",
        "https://github.com/SSW-345-Team-5"
      )
      .setColor(color);
  },
};
