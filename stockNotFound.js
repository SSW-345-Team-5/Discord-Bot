module.exports = {
  stockNotFound: (message, ticker) => {
    return stockNotFound(message, ticker);
  }
};

function stockNotFound(message, ticker) {
  message.channel.send(`Error: ${ticker} is not a valid stock`);
  throw getBreakChainError();
}

function getBreakChainError() {
  let err = new Error();
  err.name = "BreackChainError";
  return err;
}
