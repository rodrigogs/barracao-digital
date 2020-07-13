import { Firehose } from 'aws-sdk';

const firehose = new Firehose();

const {
  FACILITIES_DELIVERY_STREAM,
} = process.env;

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null);
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null);
const ensureBoolean = (image, prop) => image && (image[prop] ? image[prop].BOOL : false);

export const handler = (event, context, callback) => {
  firehose.putRecordBatch({
    DeliveryStreamName: FACILITIES_DELIVERY_STREAM,
    Records: event.Records.map((record) => ({
      Data: JSON.stringify({
        eventName: String(record.eventName),
        name: ensureString(record.dynamodb.NewImage, 'name'),
        origin: ensureString(record.dynamodb.NewImage, 'origin'),
        destination: ensureString(record.dynamodb.NewImage, 'destination'),
        techDirector: ensureString(record.dynamodb.NewImage, 'techDirector'),
        type: ensureString(record.dynamodb.NewImage, 'type'),
        active: ensureBoolean(record.dynamodb.NewImage, 'active'),
        contact: ensureString(record.dynamodb.NewImage, 'contact'),
        createdAt: ensureNumber(record.dynamodb.NewImage, 'createdAt'),
        updatedAt: ensureNumber(record.dynamodb.NewImage, 'updatedAt'),
        version: ensureNumber(record.dynamodb.NewImage, 'version'),
        approximateCreationDateTime: Number(record.dynamodb.ApproximateCreationDateTime),
        sequenceNumber: String(record.dynamodb.SequenceNumber),
        ingestedAt: Number(Date.now()),
      }),
    })),
  }, (error) => {
    if (error) return callback(error);
    return callback(null);
  });
};
