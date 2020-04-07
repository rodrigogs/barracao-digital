let timeoutID;

export default (fn, time = 100, ...args) => (() => {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(fn, time, ...args);
})();
