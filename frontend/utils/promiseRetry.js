import delay from './promiseDelay'

/**
 * @param {Function} fn
 * @param {Number} retries
 * @param {Number} time
 */
const retry = (fn, retries, time) =>
  fn().catch((err) => {
    return delay(time).then(() =>
      retries > 1 ? retry(fn, retries - 1, time) : Promise.reject(err)
    )
  })

export default retry
