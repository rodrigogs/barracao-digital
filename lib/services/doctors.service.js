import crypto from 'crypto'
import dispatch from './dispatcher'
import configsService from './configs.service'
import doctorsRepository from '../repository/doctors.repository'
import * as crmProvider from '../providers/crm'
import { ForbiddenError, BadRequestError, ConflictError, NotFoundError } from '../errors/api'
import { isValidEmail, isValidCEP } from '../helpers/format.helper'

const validateDoctorPayload = (doctor) => {
  if (!doctor.fu) throw new BadRequestError('O estado e obrigatório')
  if (!doctor.crm) throw new BadRequestError('O CRM é obrigatório')
  if (!doctor.email) throw new BadRequestError('O email é obrigatório')
  if (!isValidEmail(doctor.email)) throw new BadRequestError('Email inválido')
  if (!doctor.cep) throw new BadRequestError('O CEP é obrigatório')
  if (!isValidCEP(doctor.cep)) throw new BadRequestError('CEP inválido')
}

const checkRegionAvailability = async (cep) => {
  const facility = await dispatch('facilities', 'getOneByOrigin')(cep)
  if (!facility) return

  const {
    items: [hasActiveDoctors],
  } = await dispatch('doctors', 'getAllByCepAndActive')(facility.origin, true, { pageSize: 1 })

  if (facility.active === !!hasActiveDoctors) return

  await dispatch('facilities', 'broadcastNewStatus')(cep, !!hasActiveDoctors)
}

const service = {
  async create(doctor) {
    validateDoctorPayload(doctor)

    if (!doctor.username) throw new BadRequestError('O nome de usuário é obrigatório')

    const isUnique = !(await doctorsRepository.getOneByUsername(doctor.username))
    if (!isUnique) throw new ConflictError('An user with this username already exists')

    const result = await crmProvider.retrieve(doctor.fu, doctor.crm)
    const errorMessage = await crmProvider.validate(result)
    if (errorMessage) throw new ForbiddenError(errorMessage)

    const password = crypto.createHash('md5').update(doctor.password).digest('hex')

    return doctorsRepository.create({
      ...doctor,
      password,
      videoSessions: {},
      textSessions: {},
    })
  },

  async update(username, body) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username)
    if (!storedDoctor) throw new NotFoundError('Médico não encontrado')

    const password =
      body && body.password
        ? crypto.createHash('md5').update(body.password).digest('hex')
        : storedDoctor.password

    const shouldAlternateActive = body.active !== undefined && body.active !== storedDoctor.active

    let updatedDoctor = {
      ...storedDoctor,
      ...body,
      username,
      password,
      textSessions: { ...storedDoctor.textSessions, ...body.textSessions },
      videoSessions: { ...storedDoctor.videoSessions, ...body.videoSessions },
      active: storedDoctor.active,
      version: storedDoctor.version,
    }

    validateDoctorPayload(updatedDoctor)

    updatedDoctor = await doctorsRepository.update(updatedDoctor)
    if (shouldAlternateActive) {
      updatedDoctor = await service.alternateActive(updatedDoctor.username)
    }

    return updatedDoctor
  },

  async delete(username) {
    if (!username) return
    await doctorsRepository.delete(username)
  },

  async getOneByUsername(username) {
    return doctorsRepository.getOneByUsername(username)
  },

  async getAll({ lastEvaluatedKey, pageSize }) {
    return doctorsRepository.getAll({ lastEvaluatedKey, pageSize })
  },

  async getAllByCep(cep, { lastEvaluatedKey, pageSize }) {
    return doctorsRepository.getAllByCep(cep, { lastEvaluatedKey, pageSize })
  },

  async getAllByCepAndActive(cep, active, { lastEvaluatedKey, pageSize }) {
    return doctorsRepository.getAllByCepAndActive(cep, active, { lastEvaluatedKey, pageSize })
  },

  async alternateActive(username) {
    const storedDoctor = await doctorsRepository.getOneByUsername(username)
    const updatedDoctor = await doctorsRepository.update({
      ...storedDoctor,
      active: !storedDoctor.active,
    })
    await checkRegionAvailability(updatedDoctor.cep)
    return updatedDoctor
  },

  async setDoctorMessagingToken(doctor, _user, { token }) {
    if (!token) throw new BadRequestError('Token inválido')
    await configsService.setDoctorMessagingToken(doctor.username, token)
  },

  async createConversationSession(doctorUsername, patientTicket, { text, video }) {
    return dispatch('conversation', 'createSession')(doctorUsername, patientTicket, { text, video })
  },

  async addTextSession(doctorUsername, patientTicket) {
    console.info(
      `Adding text session for doctor "${doctorUsername}" with patient "${patientTicket}"`
    )
    return service.update(doctorUsername, {
      textSessions: {
        [patientTicket]: true,
      },
    })
  },

  async removeTextSession(doctorUsername, patientTicket) {
    console.info(
      `Removing text session for doctor "${doctorUsername}" with patient "${patientTicket}"`
    )
    return service.update(doctorUsername, {
      textSessions: {
        [patientTicket]: undefined,
      },
    })
  },

  async addVideoSession(doctorUsername, { patientTicket, token, sessionId }) {
    console.info(
      `Adding video session for doctor "${doctorUsername}" with patient "${patientTicket}"`
    )
    return service.update(doctorUsername, {
      videoSessions: {
        [patientTicket]: {
          token,
          sessionId,
        },
      },
    })
  },

  async removeVideoSession(doctorUsername, patientTicket) {
    console.info(
      `Removing video session for doctor "${doctorUsername}" with patient "${patientTicket}"`
    )
    return service.update(doctorUsername, {
      videoSessions: {
        [patientTicket]: undefined,
      },
    })
  },
}

export default service
