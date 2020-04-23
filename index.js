const botconfig = require("./botconfig.json");
const { Client, Collection } = require("discord.js");
const fs = require("fs");

const admin = require("firebase-admin");

const client = new Client({
  disableEveryone: true,
});

const serviceAccount = botconfig.firebase;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.on("ready", async () => {
  console.log(`${client.user.username} is online!`);
  client.user.setActivity("t.help", { type: "STREAMING" });
});

client.on("message", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(botconfig.prefix)
  )
    return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(botconfig.prefix.length)
    .trim()
    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args, message.author);
});

client.login(botconfig.token);
