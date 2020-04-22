import Kairos from 'kairos'

export default (start, end) => {
  const timeWaiting = end - start
  return Kairos.new(timeWaiting).toString('hh:mm', true)
}
