/* eslint-disable prefer-rest-params */
let timeoutID;
export default function (fn, time = 100) {
  const args = Array.prototype.slice.call(arguments, 2);

  return (function () {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(fn, time, ...args);
  }());
}
