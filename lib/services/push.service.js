import pushRepository from '../repository/push.repository'
import configsService from './configs.service'
import { APP_URL } from '../config'

const repository = {
  async sendMessageToPatient(patientTicket, { title, body }) {
    const token = await configsService.getPatientMessagingToken(patientTicket)
    if (!token) return
    const message = {
      token,
      notification: {
        title,
        body,
      },
      fcmOptions: {
        analyticsLabel: undefined,
      },
      android: {
        collapseKey: 'Barracão Digital',
        priority: 'high',
        ttl: 0,
      },
      webpush: {
        headers: {
          Urgency: 'high',
          TTL: '0',
        },
        notification: {
          icon: `${APP_URL}/favicon.ico`,
          timestamp: Date.now(),
        },
        fcmOptions: {
          link: `${APP_URL}/patient/${patientTicket}`,
        },
      },
    }
    await pushRepository.sendMessage(message)
  },
}

export default repository
