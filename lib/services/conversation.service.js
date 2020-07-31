import dispatch from './dispatcher'
import configsService from './configs.service'
import conversationRepository from '../repository/conversation.repository'
import { ForbiddenError, BadRequestError, NotFoundError } from '../errors/api'
import { ONGOING, WAITING_KIT } from '../enums/patientStatuses.enum'
import { v4 } from 'uuid'

const service = {
  async createSession(doctorUsername, patientTicket, { text, video }) {
    if (!text && !video) return

    if (!doctorUsername) throw new BadRequestError('Nome de usuário não informado')
    if (!patientTicket) throw new BadRequestError('Ticket do paciente não informado')

    const storedPatient = await dispatch('patients', 'getOneByTicket')(patientTicket)
    if (!storedPatient) throw new NotFoundError('O paciente não existe')
    if (![ONGOING, WAITING_KIT].includes(storedPatient.status))
      throw new ForbiddenError('O atendimento do paciente não está em andamento')

    const storedDoctor = await dispatch('doctors', 'getOneByUsername')(doctorUsername)
    if (!storedDoctor) throw new NotFoundError('O médico não existe')

    if (text) {
      await service.createTextSession(storedDoctor.cep, doctorUsername, patientTicket)
    }

    if (video) await service.createVideoSession(storedDoctor, storedPatient)

    await dispatch('patients', 'sendPushNotification')(patientTicket, {
      title: 'O médico deseja iniciar uma conversa de vídeo com você',
      body: '',
    })
  },

  async removeSession(facilityOrigin, doctorUsername, patientTicket, { text, video }) {
    if (text) await service.removeTextSession(facilityOrigin, doctorUsername, patientTicket)
    if (video) await service.removeVideoSession(doctorUsername, patientTicket)
  },

  async createTextSession(facilityCep, doctorUsername, patientTicket) {
    await conversationRepository.createTextSession(facilityCep, doctorUsername, patientTicket)
    await dispatch('patients', 'setTextSession')(patientTicket, doctorUsername)
    await dispatch('doctors', 'addTextSession')(doctorUsername, patientTicket)
  },

  async removeTextSession(facilityOrigin, doctorUsername, patientTicket) {
    await conversationRepository.removeTextSession(facilityOrigin, doctorUsername, patientTicket)
    await dispatch('patients', 'removeTextSession')(patientTicket)
    await dispatch('doctors', 'removeTextSession')(doctorUsername, patientTicket)
  },

  async createVideoSession(doctor, patient) {
    const sessionId = v4()
    const videoSession = await configsService.setVideoSession(doctor.username, patient.ticket, {
      doctor: doctor.username,
      patient: patient.ticket,
      sessionId,
    })

    await dispatch('patients', 'setVideoSession')(patient.ticket, {
      sessionId: videoSession.sessionId,
    })

    await dispatch('doctors', 'addVideoSession')(doctor.username, {
      patientTicket: patient.ticket,
      sessionId: videoSession.sessionId,
    })
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    await dispatch('patients', 'removeVideoSession')(patientTicket)
    await dispatch('doctors', 'removeVideoSession')(doctorUsername, patientTicket)
    await configsService.removeVideoSession(doctorUsername, patientTicket)
  },

  async getVideoSession(doctorUsername, patientTicket) {
    return configsService.getVideoSession(doctorUsername, patientTicket)
  },
}

export default service
