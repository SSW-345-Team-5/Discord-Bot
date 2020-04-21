const { MessageEmbed, MessageAttachment } = require("discord.js");
const { embedSend } = require("./display.js");
const { writeFilePromise } = require("./writeFile.js");
const { pythonRun } = require("./pythonRun.js");
const alpha = require("alphavantage")({
  key: require("../botconfig.json").alphavantage_key,
});
const fs = require("fs");
const admin = require("firebase-admin");

module.exports = {
  MessageEmbed,
  MessageAttachment,
  embedSend,
  writeFilePromise,
  pythonRun,
  alpha,
  fs,
  admin,
};
