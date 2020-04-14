const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const python = require("../../pythonRun.js");
const stockErr = require("../../stockNotFound.js");
const botconfig = require("../../botconfig.json");
const key = botconfig.alphavantage_key;
const alpha = require("alphavantage")({ key: key });

module.exports = {
  name: "ireport",
  aliases: ["irpt"],
  category: "indicator",
  description:
    "Returns the aggregate SMA, EMA, VWAP, MACD, RSI and ADX data for a stock.",
  usage: "<ticker> <time_interval> <series_type>",
  parameters: {
    "-time_interval":
      "time interval between data points (1/5/15/30/60min, daily, weekly monthly)",
    "-series_type": "desired price (close/open/high/low)",
  },
  run: async (client, message, args) => {
    if (args.length != 3)
      return message.channel.send(
        "Usage: <ticker> <time_interval> <series_type>"
      );
    else {
      var ticker = args[0].toLowerCase();
      var time_interval = args[1].toLowerCase();
      var series_type = args[2].toLowerCase();

      indicatorData(client, message, ticker, time_interval, series_type).then(
        () => {
          indicatorDisplay(client, message, ticker);
        }
      );

      // intradayData(client, message, ticker).then(() => {
      //   intradayDisplay(client, message, ticker);
      // });
    }
  },
  // intradayData: (client, message, ticker) => {
  //   return intradayData(client, message, ticker);
  // },
  // intradayCleanUp: (ticker) => {
  //   const output_png = `commands/stocks/${ticker}_intraday.png`;
  //   return intradayCleanUp(ticker);
  // },
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

function SMA(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .sma(ticker, time_interval, 50, series_type)
      .catch((err) => {
        // stockErr.stockNotFound(client, message, ticker);
        console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/indicator/${ticker}_${time_interval}_${series_type}_SMA.json`,
          JSON.stringify(data)
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

function EMA(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .ema(ticker, time_interval, 50, series_type)
      .catch((err) => {
        // stockErr.stockNotFound(client, message, ticker);
        console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/indicator/${ticker}_${time_interval}_${series_type}_EMA.json`,
          JSON.stringify(data)
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

function MACD(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .macd(ticker, time_interval, series_type)
      .catch((err) => {
        // stockErr.stockNotFound(client, message, ticker);
        console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/indicator/${ticker}_${time_interval}_${series_type}_MACD.json`,
          JSON.stringify(data)
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

function RSI(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .rsi(ticker, time_interval, 50, series_type)
      .catch((err) => {
        // stockErr.stockNotFound(client, message, ticker);
        console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/indicator/${ticker}_${time_interval}_${series_type}_RSI.json`,
          JSON.stringify(data)
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

function CCI(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .cci(ticker, time_interval, 50)
      .catch((err) => {
        // stockErr.stockNotFound(client, message, ticker);
        console.log(err);
      })
      .then((data) => {
        writeFilePromise(
          `commands/indicator/${ticker}_${time_interval}_${series_type}_CCI.json`,
          JSON.stringify(data)
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
  });
}

async function indicatorData(
  client,
  message,
  ticker,
  time_interval,
  series_type
) {
  await SMA(client, message, ticker, time_interval, series_type);
  await EMA(client, message, ticker, time_interval, series_type);
  await MACD(client, message, ticker, time_interval, series_type);
  await RSI(client, message, ticker, time_interval, series_type);
  await CCI(client, message, ticker, time_interval, series_type);

  var options = {
    pythonOptions: ["-u"],
    scriptPath: "./commands/indicator/",
    args: [ticker, time_interval, series_type],
  };

  var path = "ireport_chart.py";

  return new Promise((resolve, reject) => {
    python
      .pythonRun(path, options)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

function indicatorDisplay(client, message, ticker) {
  const attachment = new MessageAttachment(
    `./commands/indicator/${ticker}_ireport.docx`
  );

  return message.channel.send({ files: [attachment] }).then(() => {
    indicatorCleanUp(ticker);
  });
}

function indicatorCleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/indicator/${ticker}_ireport.docx`, cb);
}
