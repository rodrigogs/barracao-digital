import { Firehose } from 'aws-sdk'

const firehose = new Firehose()

const { DOCTORS_DELIVERY_STREAM } = process.env

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null)
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null)
const ensureBoolean = (image, prop) => image && (image[prop] ? image[prop].BOOL : false)
const ensureMap = (image, prop) => image && (image[prop] ? image[prop].M : null)

export const handler = (event, context, callback) => {
  firehose.putRecordBatch(
    {
      DeliveryStreamName: DOCTORS_DELIVERY_STREAM,
      Records: event.Records.map((record) => {
        const image =
          record.eventName === 'REMOVE' ? record.dynamodb.OldImage : record.dynamodb.NewImage
        return {
          Data: JSON.stringify({
            eventName: String(record.eventName),
            id: ensureString(image, 'id'),
            username: ensureString(image, 'username'),
            name: ensureString(image, 'name'),
            sort: ensureString(image, 'sort'),
            specialty: ensureString(image, 'specialty'),
            active: ensureBoolean(image, 'active'),
            admin: ensureBoolean(image, 'admin'),
            master: ensureBoolean(image, 'master'),
            cep: ensureString(image, 'cep'),
            crm: ensureString(image, 'crm'),
            email: ensureBoolean(image, 'email'),
            fu: ensureString(image, 'fu'),
            textSessions: Object.keys(ensureMap(image, 'textSessions') || {}).join(','),
            videoSessions: Object.keys(ensureMap(image, 'videoSessions') || {}).join(','),
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
