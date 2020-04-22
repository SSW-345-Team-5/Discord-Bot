const {
  MessageAttachment,
  pythonRun,
  fs,
  styles
} = require("../../shared/shared.js");

const quoteData = require("./quote.js");
const intraData = require("./intraday.js");
const monthData = require("./monthly.js");

module.exports = {
  name: "sreport",
  aliases: ["srpt"],
  category: "stocks",
  description: "Returns the aggregate analysis data for a stock.",
  usage: "t.sreport <ticker>",
  run: async (client, message, args, author) => {
    if (args.length != 1)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();

      reportData(client, message, ticker)
        .then(() => {
          reportDisplay(client, message, ticker, author);
        })
        .catch((err) => {
          return message.channel.send(
            JSON.parse(err.split("An AlphaVantage error occurred. ")[1])[
              "Error Message"
            ]
          );
        });
    }
  },
  reportData: (client, message, input) => {
    return reportData(client, message, input);
  },
  reportDisplay: (client, message, input) => {
    return reportData(client, message, input);
  },
  cleanUp: (ticker) => {
    return cleanUp(ticker);
  },
};

async function reportData(client, message, input) {
  const ticker = input.toLowerCase();

  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/stocks/",
    args: [ticker],
  };

  var path = "sreport.py";

  await intraData.intradayData(client, message, ticker);
  await monthData.monthlyData(client, message, ticker);
  await quoteData.quoteData(client, message, ticker);

  return new Promise((resolve, reject) => {
    pythonRun(path, options)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

function reportDisplay(client, message, ticker, author) {
  const style = styles[module.exports.category];

  const attachment = new MessageAttachment(
    `./commands/stocks/${ticker}_sreport.docx`
  );

  return message.channel
    .send(`<@${author.id}>, ${style["embed_msg"]}.`, { files: [attachment] })
    .then(() => {
      cleanUp(ticker);
    });
}

function cleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`./commands/stocks/${ticker}_sreport.docx`, cb);
  intraData.intradayCleanUp(ticker);
  monthData.monthlyCleanUp(ticker);
  quoteData.quoteCleanUp(ticker);
}
