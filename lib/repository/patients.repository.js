import { v4 as uuid } from 'uuid'
import { dynamoDB } from '../providers/aws'
import { firestore } from '../providers/firebase'
import * as telegramProvider from '../providers/telegram'
import * as smsProvider from '../providers/sms'
import { removeConditionalProps } from '../helpers/object.helper'
import { PATIENT_STATUSES } from '../enums'
import { PATIENTS_TABLE, STAGE } from '../config'

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
    const telegramGroup = events.find(
      (event) =>
        event.message.chat.type === 'supergroup' && event.message.chat.title === facilityName
    )
    if (!telegramGroup) return
    await telegramProvider.sendMessage({
      chatId: telegramGroup.message.chat.id,
      text: `O paciente *${patient.name.replace('*', '')}* com ${
        patient.age
      } anos acabou de entrar na fila`,
    })
  },

  async sendSmsMessageToPatient(patient) {
    await smsProvider.send(
      `55${patient.phone.replace(/[()]/g, '')}`,
      `Barracao Digital: Um medico esta pronto para lhe atender, retorne ao site ou app e use sua senha de retorno ${
        patient.ticket
      } para entrar, ou acesse o link https://${
        STAGE === 'production' ? 'web' : 'dev'
      }.barracaodigital.com/patient/${patient.ticket}`
    )
  },
}

export default repository
