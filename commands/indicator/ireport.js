const {
  MessageAttachment,
  embedSend,
  writeFilePromise,
  pythonRun,
  alpha,
  fs,
  styles,
} = require("../../shared/shared.js");

const data_set_size = 50;
const time_interval = "daily"; // Warning: Python not configured to parse time (h/m/s)

module.exports = {
  name: "ireport",
  aliases: ["irpt"],
  category: "indicator",
  description:
    "Returns the aggregate intraday SMA, EMA, VWAP, MACD, RSI and ADX data for a stock.",
  usage: "t.ireport <ticker> <series_type>",
  parameters: {
    "-series_type": "desired price (close/open/high/low)",
  },
  run: async (client, message, args, author) => {
    if (args.length != 2)
      return message.channel.send(`Usage: ${module.exports.usage}`);
    else {
      var ticker = args[0].toLowerCase();
      var series_type = args[1].toLowerCase();

      var acceptable_series = ["close", "open", "high", "low"];
      if (!acceptable_series.includes(series_type)) {
        return message.channel.send(`Acceptable series: ${acceptable_series}`);
      }

      indicatorData(client, message, ticker, time_interval, series_type)
        .then(() => {
          indicatorDisplay(client, message, ticker, author);
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
};

function SMA(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .sma(ticker, time_interval, data_set_size, series_type)
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
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function EMA(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .ema(ticker, time_interval, data_set_size, series_type)
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
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function MACD(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .macd(ticker, time_interval, series_type)
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
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function RSI(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .rsi(ticker, time_interval, data_set_size, series_type)
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
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function CCI(client, message, ticker, time_interval, series_type) {
  return new Promise((resolve, reject) => {
    alpha.technical
      .cci(ticker, time_interval, data_set_size)
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
      })
      .catch((err) => {
        reject(err);
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

  var path = "ireport.py";

  return new Promise((resolve, reject) => {
    pythonRun(path, options)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function indicatorDisplay(client, message, ticker, author) {
  const style = styles[module.exports.category];

  const attachment = new MessageAttachment(
    `./commands/indicator/${ticker}_ireport.docx`
  );

  return message.channel
    .send(`<@${author.id}>, ${style["embed_msg"]}.`, { files: [attachment] })
    .then(() => {
      indicatorCleanUp(ticker);
    });
}

function indicatorCleanUp(ticker) {
  const cb = function (err) {
    if (err) console.log(err);
  };
  fs.unlink(`commands/indicator/${ticker}_ireport.docx`, cb);
}
