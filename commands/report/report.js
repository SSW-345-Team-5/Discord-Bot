const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module");

const intraData = require("../intraday/intraday.js");


module.exports = {
  name: "report",
  aliases: ["rpt"],
  category: "report",
  description: "Returns the aggregate analysis data for a stock",
  usage: "[ticker]",
  run: async (client, message, args) => {
    if (args.length < 1) return message.channel.send("Usage: [ticker]");
    else return generateReport(client, message, args[0]);
  }
};

function generateReport(client, message, input) {
  const ticker = input.toLowerCase();

  intraData.intradayData(ticker).then(() => {

    var content = fs.readFileSync(
      path.resolve(__dirname, `./report.docx`),
      "binary"
    );
  
    var opts = {};
    opts.centered = false;
    opts.getImage = function(tagValue, tagName) {
      return fs.readFileSync(tagValue);
    };
  
    opts.getSize = function(img, tagValue, tagName) {
      return [300, 300];
    };
  
    var imageModule = new ImageModule(opts);
  
    var zip = new PizZip(content);
    var docx = new Docxtemplater()
      .attachModule(imageModule)
      .loadZip(zip)
      .setData({
        ticker: ticker.toUpperCase(),
        intraday_graph: `commands/intraday/${ticker}.png`
      })
      .render();
  
    var buffer = docx
      .getZip()
      .generate({ type: "nodebuffer", compression: "DEFLATE" });
  
    fs.writeFileSync(
      path.resolve(__dirname, `./${ticker}_report.docx`),
      buffer
    );
  
    const attachment = new MessageAttachment(
      `./commands/report/${ticker}_report.docx`
    );
  
    return message.channel
      .send({ files: [attachment] })
      .then(() => {
        cleanUp(ticker);
      });
  });

}

function cleanUp(ticker) {
  const cb = function(err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/report/${ticker}_report.docx`, cb);
}

