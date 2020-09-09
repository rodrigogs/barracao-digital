import * as opentok from '../providers/opentok'
import { firestore } from '../providers/firebase'
import * as aws from '../providers/aws'

const repository = {
  async createOpentokSession(options = {}) {
    return opentok.createSession(options)
  },

  // eslint-disable-next-line no-unused-vars
  async terminateOpentokSession({ apiKey, sessionId }) {
    // Check if it's possible https://tokbox.com/developer/guides/moderation/rest/
  },

  generateOpentokToken(sessionId, options) {
    const nowInSeconds = Math.round(Date.now() / 1000)
    const oneHourInSeconds = 60 * 60
    return opentok.generateToken(sessionId, {
      ...options,
      expireTime: nowInSeconds + oneHourInSeconds,
    })
  },

  async createTextSession(facilityOrigin, doctorUsername, patientTicket) {
    const collectionPath = `/facilities/${facilityOrigin}/conversations`
    const docName = `${doctorUsername}#${patientTicket}`
    return firestore.collection(collectionPath).doc(docName).set({})
  },

  async removeTextSession(facilityOrigin, doctorUsername, patientTicket) {
    const docPath = `/facilities/${facilityOrigin}/conversations/${doctorUsername}#${patientTicket}`
    const collectionPath = `${docPath}/messages`
    await firestore.deleteCollection(collectionPath, 20)
    return firestore.doc(docPath).delete()
  },

  async requestUploadUrl(file) {
    return aws.fileUploader.requestUploadUrl(file)
  },
}

export default repository
