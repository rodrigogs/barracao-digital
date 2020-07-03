import { Firehose } from 'aws-sdk'

const firehose = new Firehose()

const { CONFIGS_DELIVERY_STREAM } = process.env

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null)
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null)

export const handler = (event, context, callback) => {
  firehose.putRecordBatch(
    {
      DeliveryStreamName: CONFIGS_DELIVERY_STREAM,
      Records: event.Records.map((record) => {
        const image =
          record.eventName === 'REMOVE' ? record.dynamodb.OldImage : record.dynamodb.NewImage
        return {
          Data: JSON.stringify({
            eventName: String(record.eventName),
            partition: ensureString(image, 'partition'),
            sort: ensureString(image, 'sort'),
            cep: ensureString(image, 'cep'),
            lastTicket: ensureString(image, 'lastTicket'),
            token: ensureString(image, 'token'),
            version: ensureNumber(image, 'version'),
            approximateCreationDateTime: Number(record.dynamodb.ApproximateCreationDateTime),
            sequenceNumber: String(record.dynamodb.SequenceNumber),
            sizeBytes: Number(record.dynamodb.sizeBytes),
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
