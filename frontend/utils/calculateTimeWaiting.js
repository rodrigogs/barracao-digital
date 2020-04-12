import Kairos from 'kairos'

export default (createdAt) => {
  const timeWaiting = Date.now() - createdAt
  return Kairos.new(timeWaiting).toString('hh:mm')
}
