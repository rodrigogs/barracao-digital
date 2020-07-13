import { emoji } from 'node-emoji'
import { v4 as uuid } from 'uuid'
import { dynamoDB } from '../providers/aws'
import { firestore } from '../providers/firebase'
import * as telegramProvider from '../providers/telegram'
import { removeConditionalProps } from '../helpers/object.helper'
import { PATIENT_STATUSES } from '../enums'
import { PATIENTS_TABLE } from '../config'

const getRandomBoolean = () => Math.random() >= 0.5

const parseDynamoQueryResult = (results) => {
  const items = results.Items
  const lastEvaluatedKey = results.LastEvaluatedKey

  return {
    items,
    lastEvaluatedKey,
  }
}

const getValidFields = ({
  id,
  name,
  age,
  meds,
  allergies,
  covenant,
  cep,
  originCep,
  cpf,
  phone,
  email,
  whatsapp,
  telegram,
  hangouts,
  skype,
  hasBeenAssisted,
  status,
  lastStatus,
  createdAt,
  updatedAt,
  ticket,
  version,
  waitingStatus,
  ongoingStatus,
  finishedStatus,
  waiting_kitStatus,
  cant_be_assistedStatus,
  facility_not_availableStatus,
  gave_upStatus,
  textSession,
  videoSession,
}) => ({
  id,
  name,
  age,
  meds,
  allergies,
  covenant,
  cep,
  originCep,
  cpf,
  phone,
  email,
  whatsapp,
  telegram,
  hangouts,
  skype,
  hasBeenAssisted,
  status,
  lastStatus,
  createdAt,
  updatedAt,
  ticket,
  version,
  waitingStatus,
  ongoingStatus,
  finishedStatus,
  waiting_kitStatus,
  cant_be_assistedStatus,
  facility_not_availableStatus,
  gave_upStatus,
  textSession,
  videoSession,
})

const repository = {
  async create(object) {
    const fields = getValidFields(object)
    const status = fields.status || 'waiting'
    const createdAt = Date.now()
    const patient = {
      ...fields,
      id: uuid(),
      sort: `status#${status}#createdAt#${createdAt}`,
      status,
      lastStatus: fields.lastStatus || 'waiting',
      createdAt,
      age: Number(fields.age),
      updatedAt: Date.now(),
      version: 0,
    }
    await dynamoDB
      .put({
        TableName: PATIENTS_TABLE,
        Item: patient,
      })
      .promise()
    return patient
  },

  async update(object) {
    const fields = getValidFields(object)
    const patient = { ...fields }
    const previousVersion = patient.version
    const updatedPatient = {
      ...patient,
      sort: `status#${patient.status}#createdAt#${patient.createdAt}`,
      updatedAt: Date.now(),
      version: Number(patient.version) + 1,
    }

    await dynamoDB
      .put({
        TableName: PATIENTS_TABLE,
        Item: updatedPatient,
        ConditionExpression: '#version = :expectedVersion',
        ExpressionAttributeNames: {
          '#version': 'version',
        },
        ExpressionAttributeValues: {
          ':expectedVersion': previousVersion,
        },
      })
      .promise()

    return updatedPatient
  },

  async updateReactiveDocument(patient) {
    const { originCep, ticket } = patient

    const doc = firestore // /facilities/{cep}}/patients/{ticket}
      .collection('facilities')
      .doc(originCep)
      .collection('patients')
      .doc(ticket)

    const normalized = removeConditionalProps(
      patient,
      (value) =>
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim().length === 0) // No empty strings
    )

    return doc.set(normalized)
  },

  async getAllByOriginCep(cep, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(
      await dynamoDB
        .query({
          TableName: PATIENTS_TABLE,
          IndexName: 'originCep',
          KeyConditionExpression: '#originCep = :originCep',
          FilterExpression: '#status <> :status',
          ExpressionAttributeNames: {
            '#originCep': 'originCep',
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':originCep': cep,
            ':status': PATIENT_STATUSES.GAVE_UP,
          },
          Limit: pageSize > 20 ? 20 : pageSize,
          ExclusiveStartKey: lastEvaluatedKey,
          ScanIndexForward: true,
        })
        .promise()
    )
  },

  async getAllByOriginCepAndStatus(cep, status, { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(
      await dynamoDB
        .query({
          TableName: PATIENTS_TABLE,
          IndexName: 'originCep',
          KeyConditionExpression: '#originCep = :originCep AND begins_with(#sort, :sort)',
          FilterExpression: '#status = :status',
          ExpressionAttributeNames: {
            '#originCep': 'originCep',
            '#sort': 'sort',
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':originCep': cep,
            ':sort': `status#${status}`,
            ':status': status,
          },
          Limit: pageSize > 20 ? 20 : pageSize,
          ExclusiveStartKey: lastEvaluatedKey,
          ScanIndexForward: true,
        })
        .promise()
    )
  },

  async getAllByOriginCepAndTimeWaiting(cep, timeWaiting, { lastEvaluatedKey, pageSize = 10 }) {
    const now = Date.now()
    const expectedTime = now - timeWaiting

    return parseDynamoQueryResult(
      await dynamoDB
        .query({
          TableName: PATIENTS_TABLE,
          IndexName: 'originCep',
          KeyConditionExpression: '#originCep = :originCep',
          FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
          ExpressionAttributeNames: {
            '#originCep': 'originCep',
            '#createdAt': 'createdAt',
          },
          ExpressionAttributeValues: {
            ':originCep': cep,
            ':expectedTime': expectedTime,
            ':now': now,
          },
          Limit: pageSize > 20 ? 20 : pageSize,
          ExclusiveStartKey: lastEvaluatedKey,
          ScanIndexForward: true,
        })
        .promise()
    )
  },

  async getAllByOriginCepAndStatusAndTimeWaiting(
    cep,
    status,
    timeWaiting,
    { lastEvaluatedKey, pageSize = 10 }
  ) {
    const now = Date.now()
    const expectedTime = now - timeWaiting

    return parseDynamoQueryResult(
      await dynamoDB
        .query({
          TableName: PATIENTS_TABLE,
          IndexName: 'originCep',
          KeyConditionExpression: '#originCep = :originCep AND begins_with(#sort, :sort)',
          FilterExpression: '#createdAt BETWEEN :expectedTime AND :now',
          ExpressionAttributeNames: {
            '#originCep': 'originCep',
            '#sort': 'sort',
            '#createdAt': 'createdAt',
          },
          ExpressionAttributeValues: {
            ':originCep': cep,
            ':sort': `status#${status}`,
            ':expectedTime': expectedTime,
            ':now': now,
          },
          Limit: pageSize > 20 ? 20 : pageSize,
          ExclusiveStartKey: lastEvaluatedKey,
          ScanIndexForward: true,
        })
        .promise()
    )
  },

  async getOneByTicket(ticket) {
    return dynamoDB
      .get({
        TableName: PATIENTS_TABLE,
        Key: {
          ticket,
        },
      })
      .promise()
      .then((result) => result.Item)
  },

  async informFacilityDoctors(facilityName, patient) {
    const { result: events } = await telegramProvider.getUpdates()
    const telegramGroup = events.find((event) => event.message.chat.title === facilityName)
    if (!telegramGroup) return
    await telegramProvider.sendMessage({
      chatId: telegramGroup.message.chat.id,
      text: `O paciente *${patient.name}* com ${patient.age} anos acabou de entrar na fila`,
    })
    // I'm in the mood for an easter egg
    if (patient.age <= 12) {
      return (
        getRandomBoolean() &&
        telegramProvider.sendMessage({
          chatId: telegramGroup.message.chat.id,
          text: `Olha o palavreado na frente das crianças ${emoji.stuck_out_tongue}`,
        })
      )
    }
    if (patient.age < 18) {
      return (
        getRandomBoolean() &&
        telegramProvider.sendMessage({
          chatId: telegramGroup.message.chat.id,
          text: `Um adolescente\nAtenda antes que ele se irrite e vá reclamar do sistema na internet ${emoji.smiling_face_with_smiling_eyes_and_hand_covering_mouth}`,
        })
      )
    }
    if (patient.age >= 60 && patient.age <= 85) {
      return telegramProvider.sendMessage({
        chatId: telegramGroup.message.chat.id,
        text: 'Atenção! Paciente é *grupo de risco*!',
      })
    }
    if (patient.age >= 85) {
      return telegramProvider.sendMessage({
        chatId: telegramGroup.message.chat.id,
        text: `${emoji.rotating_light}${emoji.rotating_light}${emoji.rotating_light} PACIENTE DE ALTO RISCO ${emoji.rotating_light}${emoji.rotating_light}${emoji.rotating_light}`,
      })
    }
  },
}

export default repository
