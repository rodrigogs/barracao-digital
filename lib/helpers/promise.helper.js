const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

module.exports = {
  wait,
};
