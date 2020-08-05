/* eslint-disable camelcase */
import dispatch from './dispatcher'
import configsService from './configs.service'
import telegramRepository from '../repository/telegram.repository'
import pushService from './push.service'
import patientsRepository from '../repository/patients.repository'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/api'
import { PATIENT_STATUSES } from '../enums'
import { asArray as patientStatusesAsArray } from '../enums/patientStatuses.enum'
import { isValidCPF } from '../helpers/format.helper'
import { wait as promiseWait } from '../helpers/promise.helper'
import { APP_URL } from '../config'
import { conversationService } from './index'

const validateStatus = (status) => {
  if (patientStatusesAsArray.indexOf(status) === -1)
    throw new BadRequestError(`O status "${status}" é inválido`)
}

const validatePatientPayload = (patient) => {
  if (!patient.name) throw new BadRequestError('O nome é obrigatório')
  if (!patient.cep) throw new BadRequestError('O CEP é obrigatório')
  if (!patient.cpf) throw new BadRequestError('O CPF é obrigatório')
  if (!isValidCPF(patient.cpf)) throw new BadRequestError('O CPF é inválido')
}

const getNextTicket = async (retries = 0) => {
  try {
    let config = await configsService.getPatientsLastTicket()
    if (!config) config = await configsService.setPatientsLastTicket(0, 0)

    const { lastTicket } = config
    const nextTicket = String(Number(lastTicket) + 1)

    await configsService.setPatientsLastTicket(nextTicket, config.version)
    const prefix = String(Date.now()).substr(nextTicket.length + 4)
    return `${prefix}${nextTicket}`
  } catch (err) {
    if (err.message.startsWith('The conditional request failed') && retries < 10) {
      await promiseWait(200)
      return getNextTicket(retries + 1)
    }
    throw err
  }
}

const service = {
  async create(patient) {
    validatePatientPayload(patient)

    if (patient.ticket) {
      const isTicketInUse = !!(await patientsRepository.getOneByTicket(patient.ticket))
      if (isTicketInUse) throw new ConflictError('Este ticket já foi utilizado')
    }

    let status = PATIENT_STATUSES.WAITING
    let facility = null

    try {
      facility = await dispatch('facilities', 'getOneByDestination')(patient.cep)
      const {
        items: [hasActiveDoctors],
      } = await dispatch('doctors', 'getAllByCepAndActive')(facility.origin, true, { pageSize: 1 })
      if (!hasActiveDoctors) {
        status = PATIENT_STATUSES.CANT_BE_ASSISTED
      }
    } catch (err) {
      if (err instanceof NotFoundError) {
        status = PATIENT_STATUSES.FACILITY_NOT_AVAILABLE
      } else {
        throw err
      }
    }

    const createdPatient = await patientsRepository.create({
      ...patient,
      status,
      lastStatus: PATIENT_STATUSES.WAITING,
      originCep: facility ? facility.origin : undefined,
      ticket: patient.ticket || (await getNextTicket()),
      [`${PATIENT_STATUSES.ONGOING}Status`]: undefined,
      [`${PATIENT_STATUSES.FINISHED}Status`]: undefined,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: undefined,
      [`${PATIENT_STATUSES.CANT_BE_ASSISTED}Status`]: undefined,
      [`${PATIENT_STATUSES.FACILITY_NOT_AVAILABLE}Status`]: undefined,
      [`${PATIENT_STATUSES.GAVE_UP}Status`]: undefined,
      [`${status}Status`]: {
        timestamp: Date.now(),
      },
    })

    await service.informFacilityDoctors(
      facility,
      `O paciente *${createdPatient.name.replace('*', '')}* com *${
        patient.age
      }* anos acabou de entrar na fila. Sua senha é [${createdPatient.ticket}](${APP_URL}/doctor/${
        createdPatient.ticket
      }).`
    )

    if (createdPatient.originCep) await patientsRepository.updateReactiveDocument(createdPatient)

    return createdPatient
  },

  async update(
    ticket,
    {
      status,
      lastStatus,
      ongoingStatus,
      waiting_kitStatus,
      finishedStatus,
      textSession,
      videoSession,
    }
  ) {
    if (status) validateStatus(status)

    const storedPatient = await patientsRepository.getOneByTicket(ticket)
    if (!storedPatient) throw new NotFoundError('Patient Not Found')

    const resolveValue = (property, value) => {
      if (value === null) return undefined
      if (value) return value
      return storedPatient[property]
    }

    const updatingPatient = {
      ...storedPatient,
      status: resolveValue('status', status),
      lastStatus: resolveValue('lastStatus', lastStatus),
      ongoingStatus: resolveValue('ongoingStatus', ongoingStatus),
      waiting_kitStatus: resolveValue('waiting_kitStatus', waiting_kitStatus),
      finishedStatus: resolveValue('finishedStatus', finishedStatus),
      textSession: resolveValue('textSession', textSession),
      videoSession: resolveValue('videoSession', videoSession),
    }

    const updatedPatient = await patientsRepository.update(updatingPatient)
    if (updatedPatient.originCep) await patientsRepository.updateReactiveDocument(updatedPatient)
    return updatedPatient
  },

  async getAllByOriginCep(cep, { lastEvaluatedKey, pageSize }) {
    return patientsRepository.getAllByOriginCep(cep, { lastEvaluatedKey, pageSize })
  },

  async getAllByOriginCepAndStatus(cep, status, { lastEvaluatedKey, pageSize }) {
    validateStatus(status)

    return patientsRepository.getAllByOriginCepAndStatus(cep, status, {
      lastEvaluatedKey,
      pageSize,
    })
  },

  async getAllByOriginCepAndTimeWaiting(cep, timeWaiting, { lastEvaluatedKey, pageSize }) {
    return patientsRepository.getAllByOriginCepAndTimeWaiting(cep, timeWaiting, {
      lastEvaluatedKey,
      pageSize,
    })
  },

  async getAllByOriginCepAndStatusAndTimeWaiting(
    cep,
    status,
    timeWaiting,
    { lastEvaluatedKey, pageSize }
  ) {
    validateStatus(status)

    return patientsRepository.getAllByOriginCepAndStatusAndTimeWaiting(cep, status, timeWaiting, {
      lastEvaluatedKey,
      pageSize,
    })
  },

  async getOneByTicket(ticket) {
    return patientsRepository.getOneByTicket(ticket)
  },

  async sendPushNotification(patientTicket, { title, body }) {
    try {
      await pushService.sendMessageToPatient(patientTicket, { title, body })
    } catch (err) {
      console.error('Error sending push notification:', err)
    }
  },

  async informFacilityDoctors(facility, message) {
    try {
      let chatId = await telegramRepository.findGroupIdByChatTitle(facility.name)
      if (chatId) await configsService.persistFacilityChatId(facility.origin, chatId)
      if (!chatId) {
        const facilityChatConfig = await configsService.retrieveFacilityChatId(facility.origin)
        if (facilityChatConfig) chatId = facilityChatConfig.chatId
      }
      if (!chatId) return
      await telegramRepository.sendMessage({ chatId, message, disableWebPagePreview: true })
    } catch (err) {
      console.error(err)
    }
  },

  async setCantBeAssisted(patient) {
    const updatedPatient = {
      ...patient,
      lastStatus: patient.status,
      status: PATIENT_STATUSES.CANT_BE_ASSISTED,
      [`${PATIENT_STATUSES.CANT_BE_ASSISTED}Status`]: {
        timestamp: Date.now(),
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'O barracão onde você estava sendo atendido fechou',
      body: 'Infelizmente não poderemos lhe atender no momento.',
    })
    return storedPatient
  },

  async setWaiting(patient) {
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.WAITING,
      lastStatus:
        patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED ? patient.lastStatus : patient.status,
      [`${PATIENT_STATUSES.WAITING}Status`]: {
        timestamp: Date.now(),
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Barracão disponível',
      body: 'O barracão da sua região está funcionando novamente',
    })
    return storedPatient
  },

  async setOngoing(patient, user = {}, { message } = {}) {
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    const oldStatus = patient[`${PATIENT_STATUSES.ONGOING}Status`] || {}
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.ONGOING,
      lastStatus:
        patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED ? patient.lastStatus : patient.status,
      [`${PATIENT_STATUSES.ONGOING}Status`]: {
        doctorUsername: user.username || oldStatus.doctorUsername,
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        timestamp: Date.now(),
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Um médico está dando andamento na sua solicitação',
      body: message,
    })
    const doctorName = user ? user.name : oldStatus.doctorName
    if (doctorName) {
      await service.informFacilityDoctors(
        patientFacility,
        `O paciente *${patient.name.replace(
          '*',
          ''
        )}* está sendo atendido pelo médico *${doctorName.replace('*', '')}*`
      )
    }
    return storedPatient
  },

  async setWaitingKit(patient, user = {}, { message } = {}) {
    if (!message && !patient[`${PATIENT_STATUSES.WAITING_KIT}Status`]) {
      throw new BadRequestError(
        'O médico deve deixar instruções para o paciente ao trocar o status para "Aguardando kit"'
      )
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    const oldStatus = patient[`${PATIENT_STATUSES.WAITING_KIT}Status`] || {}
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.WAITING_KIT,
      lastStatus:
        patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED ? patient.lastStatus : patient.status,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: {
        doctorUsername: user.username || oldStatus.doctorUsername,
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        receivedAt: oldStatus.receivedAt,
        receivedMessage: oldStatus.receivedMessage,
        sentAt: oldStatus.sentAt,
        sentMessage: oldStatus.sentMessage,
        timestamp: oldStatus.timestamp || Date.now(),
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Seu status foi alterado para "Aguardando kit"',
      body: message,
    })
    await service.informFacilityDoctors(
      patientFacility,
      `O médico *${user.name.replace(
        '*',
        ''
      )}* acabou de enviar um kit médico para o paciente *${patient.name.replace('*', '')}*`
    )
    return storedPatient
  },

  async setReceivedKit(patient, user = {}, { message } = {}) {
    if (patient.status !== PATIENT_STATUSES.WAITING_KIT)
      throw new ConflictError('O status do paciente não é "Aguardando kit"')
    const waitingKitStatus = patient[`${PATIENT_STATUSES.WAITING_KIT}Status`] || {}
    const updatedPatient = {
      ...patient,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: {
        ...waitingKitStatus,
        receivedAt: Date.now(),
        receivedMessage: message,
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    // TODO send a push notification to the doctor
    console.log('TODO send a push notification to the doctor', user)
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    await service.informFacilityDoctors(
      patientFacility,
      `O paciente *${patient.name.replace(
        '*',
        ''
      )}* acabou de assinalar o recebimento do kit médico`
    )
    return storedPatient
  },

  async setSentKit(patient, user = {}, { message } = {}) {
    if (patient.status !== PATIENT_STATUSES.WAITING_KIT)
      throw new ConflictError('O status do paciente não é "Aguardando kit"')
    const waitingKitStatus = patient[`${PATIENT_STATUSES.WAITING_KIT}Status`] || {}
    const updatedPatient = {
      ...patient,
      [`${PATIENT_STATUSES.WAITING_KIT}Status`]: {
        ...waitingKitStatus,
        sentAt: Date.now(),
        sentMessage: message,
      },
    }
    const storedPatient = await service.update(patient.ticket, updatedPatient)
    // TODO send a push notification to the doctor
    console.log('TODO send a push notification to the doctor', user)
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    await service.informFacilityDoctors(
      patientFacility,
      `O paciente *${patient.name.replace(
        '*',
        ''
      )}* acabou de assinalar que o kit médico foi enviado de volta`
    )
    return storedPatient
  },

  async setFinished(patient, user = {}, { message, outcome } = {}) {
    if (!outcome && !patient[`${PATIENT_STATUSES.FINISHED}Status`]) {
      throw new BadRequestError(
        'O médico deve informar o desfecho do paciente ao trocar o status para "Finalizado"'
      )
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    const oldStatus = patient[`${PATIENT_STATUSES.FINISHED}Status`] || {}
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.FINISHED,
      lastStatus:
        patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED ? patient.lastStatus : patient.status,
      [`${PATIENT_STATUSES.FINISHED}Status`]: {
        doctorUsername: user.username || oldStatus.doctorUsername,
        doctorName: user.name || oldStatus.doctorName,
        doctorCrm: user.crm || oldStatus.doctorCrm,
        doctorState: user.fu || oldStatus.doctorState,
        doctorMessage: message || oldStatus.doctorMessage,
        facilityName: patientFacility.name || oldStatus.facilityName,
        patientOutcome: outcome || oldStatus.patientOutcome,
        patientFeedback: undefined,
        timestamp: Date.now(),
      },
    }

    delete updatedPatient.textSession
    delete updatedPatient.videoSession

    const storedPatient = await service.update(patient.ticket, updatedPatient)
    if (patient.textSession) {
      await dispatch('conversation', 'removeSession')(
        patient.originCep,
        user.username || oldStatus.doctorUsername,
        patient.ticket,
        { text: true, video: true }
      )
    }
    await service.sendPushNotification(storedPatient.ticket, {
      title: 'Um médico finalizou seu atendimento',
      body: message,
    })
    await service.informFacilityDoctors(
      patientFacility,
      `O médico *${user.name.replace(
        '*',
        ''
      )}* finalizou o atendimento do paciente *${patient.name.replace('*', '')}*`
    )
    return storedPatient
  },

  async setGaveUp(patient) {
    const updatedPatient = {
      ...patient,
      status: PATIENT_STATUSES.GAVE_UP,
      lastStatus:
        patient.status === PATIENT_STATUSES.CANT_BE_ASSISTED ? patient.lastStatus : patient.status,
      [`${PATIENT_STATUSES.GAVE_UP}Status`]: {
        timestamp: Date.now(),
      },
    }

    delete updatedPatient.textSession
    delete updatedPatient.videoSession

    const storedPatient = await service.update(patient.ticket, updatedPatient)
    if (patient.textSession) {
      await dispatch('conversation', 'removeSession')(
        patient.originCep,
        patient.textSession,
        patient.ticket,
        { text: true, video: true }
      )
    }
    const patientFacility = await dispatch('facilities', 'getOneByOrigin')(patient.originCep)
    await service.informFacilityDoctors(
      patientFacility,
      `O paciente *${patient.name.replace('*', '')}* desistiu do atendimento`
    )
    return storedPatient
  },

  async setPatientFeedback(patient, _user, { value }) {
    if (value < 1 || value > 5) {
      throw new BadRequestError('O feedback do paciente deve ser um número de 1 a 5')
    }
    const updatedPatient = {
      ...patient,
      [`${PATIENT_STATUSES.FINISHED}Status`]: {
        ...patient[`${PATIENT_STATUSES.FINISHED}Status`],
        patientFeedback: value,
      },
    }
    return service.update(patient.ticket, updatedPatient)
  },

  async setPatientMessagingToken(patient, _user, { token }) {
    if (!token) throw new BadRequestError('Token inválido')
    await configsService.setPatientMessagingToken(patient.ticket, token)
  },

  async setTextSession(patientTicket, doctorUsername) {
    console.info(`Setting text session for patient "${patientTicket}"`)
    return service.update(patientTicket, {
      textSession: doctorUsername,
    })
  },

  async removeTextSession(patientTicket) {
    console.info(`Removing video session for patient "${patientTicket}"`)
    return service.update(patientTicket, { textSession: null })
  },

  async setVideoSession(ticket, { token, sessionId }) {
    console.info(`Setting video session for patient "${ticket}"`)
    return service.update(ticket, {
      videoSession: {
        token,
        sessionId,
      },
    })
  },

  async removeVideoSession(ticket) {
    console.info(`Removing video session for patient "${ticket}"`)
    return service.update(ticket, { videoSession: null })
  },

  async sendSmsMessageToPatient(patient) {
    await patientsRepository.sendSmsMessageToPatient(patient)
  },

  async requestUploadUrl(file) {
    return conversationService.requestUploadUrl(file)
  },
}

export default service
