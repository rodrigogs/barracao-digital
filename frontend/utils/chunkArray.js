/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export default function chunkArray(myArray, chunkSize) {
  const results = []

  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize))
  }

  return results
}
