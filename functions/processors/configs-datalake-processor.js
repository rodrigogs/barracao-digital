import { Firehose } from 'aws-sdk';

const firehose = new Firehose();

const {
  CONFIGS_DELIVERY_STREAM,
} = process.env;

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null);
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null);

export const handler = (event, context, callback) => {
  firehose.putRecordBatch({
    DeliveryStreamName: CONFIGS_DELIVERY_STREAM,
    Records: event.Records.map((record) => ({
      Data: JSON.stringify({
        eventName: String(record.eventName),
        partition: ensureString(record.dynamodb.NewImage, 'partition'),
        sort: ensureString(record.dynamodb.NewImage, 'sort'),
        lastTicket: ensureString(record.dynamodb.NewImage, 'lastTicket'),
        token: ensureString(record.dynamodb.NewImage, 'token'),
        version: ensureNumber(record.dynamodb.NewImage, 'version'),
        approximateCreationDateTime: Number(record.dynamodb.ApproximateCreationDateTime),
        sequenceNumber: String(record.dynamodb.SequenceNumber),
        sizeBytes: Number(record.dynamodb.sizeBytes),
        ingestedAt: Number(Date.now()),
      }),
    })),
  }, (error) => {
    if (error) return callback(error);
    return callback(null);
  });
};
