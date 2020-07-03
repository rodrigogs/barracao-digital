import firebase from '../providers/firebase'

const repository = {
  async sendMessage(message) {
    return firebase.messaging.send(message)
  },
}

export default repository
