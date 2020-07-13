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
    Records: event.Records.map((record) => {
      const image = record.eventName === 'REMOVE'
        ? record.dynamodb.OldImage
        : record.dynamodb.NewImage;
      return ({
        Data: JSON.stringify({
          eventName: String(record.eventName),
          name: ensureString(image, 'name'),
          origin: ensureString(image, 'origin'),
          destination: ensureString(image, 'destination'),
          techDirector: ensureString(image, 'techDirector'),
          type: ensureString(image, 'type'),
          active: ensureBoolean(image, 'active'),
          contact: ensureString(image, 'contact'),
          createdAt: ensureNumber(image, 'createdAt'),
          updatedAt: ensureNumber(image, 'updatedAt'),
          version: ensureNumber(image, 'version'),
          approximateCreationDateTime: Number(record.dynamodb.ApproximateCreationDateTime),
          sequenceNumber: String(record.dynamodb.SequenceNumber),
          ingestedAt: Number(Date.now()),
        }),
      });
    }),
  }, (error) => {
    if (error) return callback(error);
    return callback(null);
  });
};
