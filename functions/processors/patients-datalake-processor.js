import { Firehose } from 'aws-sdk'

const firehose = new Firehose()

const { PATIENTS_DELIVERY_STREAM } = process.env

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null)
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null)
const ensureBoolean = (image, prop) => image && (image[prop] ? image[prop].BOOL : false)
const ensureMap = (image, prop) => image && (image[prop] ? image[prop].M : null)

export const handler = (event, context, callback) => {
  firehose.putRecordBatch(
    {
      DeliveryStreamName: PATIENTS_DELIVERY_STREAM,
      Records: event.Records.map((record) => {
        const image =
          record.eventName === 'REMOVE' ? record.dynamodb.OldImage : record.dynamodb.NewImage
        return {
          Data: JSON.stringify({
            eventName: String(record.eventName),
            id: ensureString(image, 'id'),
            age: ensureNumber(image, 'age'),
            name: ensureString(image, 'name'),
            sort: ensureString(image, 'sort'),
            email: ensureString(image, 'email'),
            status: ensureString(image, 'status'),
            lastStatus: ensureString(image, 'lastStatus'),
            hasBeenAssisted: ensureBoolean(image, 'hasBeenAssisted'),
            covenant: ensureString(image, 'coventant'),
            cep: ensureString(image, 'cep'),
            originCep: ensureString(image, 'originCep'),
            cpf: ensureString(image, 'cpf'),
            meds: ensureString(image, 'meds'),
            allergies: ensureString(image, 'allergies'),
            ticket: ensureString(image, 'ticket'),
            textSession: ensureString(image, 'textSession'),
            videoSession: ensureString(ensureMap(image, 'videoSession'), 'sessionId'),
            gave_upStatus_timestamp: ensureNumber(ensureMap(image, 'gave_upStatus'), 'timestamp'),
            cantBeAssistedStatus_timestamp: ensureNumber(
              ensureMap(image, 'cantBeAssistedStatus'),
              'timestamp'
            ),
            waitingStatus_timestamp: ensureNumber(ensureMap(image, 'waitingStatus'), 'timestamp'),
            ongoingStatus_doctorUsername: ensureString(
              ensureMap(image, 'ongoingStatus'),
              'doctorUsername'
            ),
            ongoingStatus_doctorName: ensureString(ensureMap(image, 'ongoingStatus'), 'doctorName'),
            ongoingStatus_doctorCrm: ensureString(ensureMap(image, 'ongoingStatus'), 'doctorCrm'),
            ongoingStatus_doctorState: ensureString(
              ensureMap(image, 'ongoingStatus'),
              'doctorState'
            ),
            ongoingStatus_doctorMessage: ensureString(
              ensureMap(image, 'ongoingStatus'),
              'doctorMessage'
            ),
            ongoingStatus_facilityName: ensureString(
              ensureMap(image, 'ongoingStatus'),
              'facilityName'
            ),
            ongoingStatus_timestamp: ensureNumber(ensureMap(image, 'ongoingStatus'), 'timestamp'),
            waiting_kitStatus_doctorUsername: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'doctorUsername'
            ),
            waiting_kitStatus_doctorName: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'doctorName'
            ),
            waiting_kitStatus_doctorCrm: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'doctorCrm'
            ),
            waiting_kitStatus_doctorState: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'doctorState'
            ),
            waiting_kitStatus_doctorMessage: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'doctorMessage'
            ),
            waiting_kitStatus_facilityName: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'facilityName'
            ),
            waiting_kitStatus_receivedAt: ensureNumber(
              ensureMap(image, 'waiting_kitStatus'),
              'receivedAt'
            ),
            waiting_kitStatus_receivedMessage: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'receivedMessage'
            ),
            waiting_kitStatus_sentAt: ensureNumber(ensureMap(image, 'waiting_kitStatus'), 'sentAt'),
            waiting_kitStatus_sentMessage: ensureString(
              ensureMap(image, 'waiting_kitStatus'),
              'sentMessage'
            ),
            waiting_kitStatus_timestamp: ensureNumber(
              ensureMap(image, 'waiting_kitStatus'),
              'timestamp'
            ),
            finishedStatus_doctorUsername: ensureString(
              ensureMap(image, 'finishedStatus'),
              'doctorUsername'
            ),
            finishedStatus_doctorName: ensureString(
              ensureMap(image, 'finishedStatus'),
              'doctorName'
            ),
            finishedStatus_doctorCrm: ensureString(ensureMap(image, 'finishedStatus'), 'doctorCrm'),
            finishedStatus_doctorState: ensureString(
              ensureMap(image, 'finishedStatus'),
              'doctorState'
            ),
            finishedStatus_doctorMessage: ensureString(
              ensureMap(image, 'finishedStatus'),
              'doctorMessage'
            ),
            finishedStatus_facilityName: ensureString(
              ensureMap(image, 'finishedStatus'),
              'facilityName'
            ),
            finishedStatus_patientOutcome: ensureString(
              ensureMap(image, 'finishedStatus'),
              'patientOutcome'
            ),
            finishedStatus_patientFeedback: ensureNumber(
              ensureMap(image, 'finishedStatus'),
              'patientFeedback'
            ),
            finishedStatus_timestamp: ensureNumber(ensureMap(image, 'finishedStatus'), 'timestamp'),
            createdAt: ensureNumber(image, 'createdAt'),
            updatedAt: ensureNumber(image, 'updatedAt'),
            version: ensureNumber(image, 'version'),
            approximateCreationDateTime: Number(record.dynamodb.ApproximateCreationDateTime),
            sequenceNumber: String(record.dynamodb.SequenceNumber),
            ingestedAt: Number(Date.now()),
          }),
        }
      }),
    },
    (error) => {
      if (error) return callback(error)
      return callback(null)
    }
  )
}
