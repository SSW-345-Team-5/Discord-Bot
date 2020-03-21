const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("python-shell");

const botconfig = require("./../../botconfig.json");
const key = botconfig.alphavantage_key;

const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "intraday",
  aliases: ["in"],
  category: "stocks",
  description:
    "Returns a graph for each of the input data fields over the selected intraday data",
  usage: "[ticker] [time_interval] [data_1] <data_2>...",
  parameters: {
    time_interval: "minutes between samples: 1/5/15/30/60",
    data_fields: "open/high/low/close/volume"
  },
  run: async (client, message, args) => {
    if (args.length < 1)
      return message.channel.send(
        "Usage: [ticker] [time_interval] [data_1] <data_2>..."
      );
    else return intradayData(client, message, args[0]);
  }
};

function intradayData(client, message, input) {
  const embed = new MessageEmbed();

  const ticker = input.toLowerCase();

  const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, error => {
        if (error) reject(error);
        resolve();
      });
    });
  };

  alpha.data.intraday(ticker).then(data => {
    writeFilePromise(
      `commands/stocks/intraday_data/${ticker}.json`,
      JSON.stringify(data)
    ).then(() => {
      var options = {
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: "./commands/stocks/intraday_data/",
        args: ticker
      };

      let pyshell = new python.PythonShell("chart.py", options);

      pyshell.end(function(err) {
        const attachment = new MessageAttachment(
          `commands/stocks/intraday_data/${ticker}.png`
        );

        embed.image = { url: `attachment://${ticker}.png` };
        embed.setColor("BLUE");

        return message.channel
          .send({ files: [attachment], embed: embed })
          .then(() => {
            cleanUp(ticker);
          });
      });
    });
  });
}

function cleanUp(ticker) {
  const cb = function(err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/stocks/intraday_data/${ticker}.json`, cb);
  fs.unlink(`commands/stocks/intraday_data/${ticker}.png`, cb);
}
