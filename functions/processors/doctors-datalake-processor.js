import { Firehose } from 'aws-sdk';

const firehose = new Firehose();

const {
  DOCTORS_DELIVERY_STREAM,
} = process.env;

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null);
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null);
const ensureBoolean = (image, prop) => image && (image[prop] ? image[prop].BOOL : false);
const ensureMap = (image, prop) => image && (image[prop] ? image[prop].M : null);

export const handler = (event, context, callback) => {
  firehose.putRecordBatch({
    DeliveryStreamName: DOCTORS_DELIVERY_STREAM,
    Records: event.Records.map((record) => ({
      Data: JSON.stringify({
        eventName: String(record.eventName),
        id: ensureString(record.dynamodb.NewImage, 'id'),
        username: ensureString(record.dynamodb.NewImage, 'username'),
        name: ensureString(record.dynamodb.NewImage, 'name'),
        sort: ensureString(record.dynamodb.NewImage, 'sort'),
        specialty: ensureString(record.dynamodb.NewImage, 'specialty'),
        active: ensureBoolean(record.dynamodb.NewImage, 'active'),
        admin: ensureBoolean(record.dynamodb.NewImage, 'admin'),
        master: ensureBoolean(record.dynamodb.NewImage, 'master'),
        cep: ensureString(record.dynamodb.NewImage, 'cep'),
        crm: ensureString(record.dynamodb.NewImage, 'crm'),
        email: ensureBoolean(record.dynamodb.NewImage, 'email'),
        fu: ensureString(record.dynamodb.NewImage, 'fu'),
        textSessions: Object
          .keys(ensureMap(record.dynamodb.NewImage, 'textSessions') || {})
          .join(','),
        videoSessions: Object
          .keys(ensureMap(record.dynamodb.NewImage, 'videoSessions') || {})
          .join(','),
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
