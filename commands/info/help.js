const { embedSend, styles } = require("../../shared/shared.js");
const { stripIndents } = require("common-tags");

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "info",
  description: "Returns a list of commands, or one specific command's info.",
  usage: "t.help [cmd]",
  run: async (client, message, args, author) => {
    if (args[0]) {
      return getCMD(client, message, args[0]);
    } else {
      return getAll(client, message);
    }
  },
};

const style = styles[module.exports.category];

function getAll(client, message) {
  const embed = embedSend(style["embed_color"]);

  const commands = (category) => {
    return client.commands
      .filter((cmd) => cmd.category === category)
      .map((cmd) => `- \`${cmd.name}\``)
      .join("\n");
  };

  const info = client.categories
    .map(
      (cat) =>
        stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(
          cat
        )}`
    )
    .reduce((string, category) => string + "\n" + category);

  return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
  const embed = embedSend(style["embed_color"]);

  const cmd =
    client.commands.get(input.toLowerCase()) ||
    client.commands.get(client.aliases.get(input.toLowerCase()));

  let info = `No information found for command **${input.toLowerCase()}**`;

  if (!cmd) {
    return message.channel.send(embed.setColor("RED").setDescription(info));
  }

  if (cmd.name) info = `**Command name**: ${cmd.name}`;
  if (cmd.aliases)
    info += `\n**Aliases**: ${cmd.aliases.map((a) => `\`${a}\``).join(", ")}`;
  if (cmd.description) info += `\n**Description**: ${cmd.description}`;
  if (cmd.usage) {
    info += `\n**Usage**: ${cmd.usage}`;
    embed.setFooter(`Syntax: <> = required, [] = optional`);
  }
  if (cmd.parameters) {
    info += `\n**Parameters**:`;
    for (let key of Object.keys(cmd.parameters)) {
      info += `\n${key}: ${cmd.parameters[key]}`;
    }
  }

  return message.channel.send(embed.setColor("GREEN").setDescription(info));
}
