const botconfig = require("./botconfig.json");
const { Client, RichEmbed, Collection } = require("discord.js");

const client = new Client({
  disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

client.on("ready", async () => {
  console.log(`${client.user.username} is online!`);
});

client.on("message", async message => {
  if (
    message.author.client ||
    !message.guild ||
    !message.content.startsWith(prefix)
  )
    return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = messege.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

client.login(botconfig.token);
