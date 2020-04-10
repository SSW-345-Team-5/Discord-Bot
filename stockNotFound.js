module.exports = {
  stockNotFound: (client, message, ticker) => {
    return stockNotFound(client, message, ticker);
  }
};

function stockNotFound(client, message, ticker) {
  message.channel.send(`Error: ${ticker.toUpperCase()} is not a valid stock`);
  throw getBreakChainError();
}

function getBreakChainError() {
  let err = new Error();
  err.name = "BreackChainError";
  return err;
}
