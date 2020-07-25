import { messaging } from '../providers/firebase'

const repository = {
  async sendMessage(message) {
    return messaging.send(message)
  },
}

export default repository
