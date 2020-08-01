import { firestore } from '../providers/firebase'
import * as aws from '../providers/aws'

const repository = {
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
