import { Firehose } from 'aws-sdk';

const firehose = new Firehose();

const {
  PATIENTS_DELIVERY_STREAM,
} = process.env;

const ensureString = (image, prop) => image && (image[prop] ? image[prop].S : null);
const ensureNumber = (image, prop) => image && (image[prop] ? image[prop].N : null);
const ensureBoolean = (image, prop) => image && (image[prop] ? image[prop].BOOL : false);
const ensureMap = (image, prop) => image && (image[prop] ? image[prop].M : null);

export const handler = (event, context, callback) => {
  firehose.putRecordBatch({
    DeliveryStreamName: PATIENTS_DELIVERY_STREAM,
    Records: event.Records.map((record) => ({
      Data: JSON.stringify({
        eventName: String(record.eventName),
        id: ensureString(record.dynamodb.NewImage, 'id'),
        age: ensureNumber(record.dynamodb.NewImage, 'age'),
        name: ensureString(record.dynamodb.NewImage, 'name'),
        sort: ensureString(record.dynamodb.NewImage, 'sort'),
        email: ensureString(record.dynamodb.NewImage, 'email'),
        status: ensureString(record.dynamodb.NewImage, 'status'),
        lastStatus: ensureString(record.dynamodb.NewImage, 'lastStatus'),
        hasBeenAssisted: ensureBoolean(record.dynamodb.NewImage, 'hasBeenAssisted'),
        covenant: ensureString(record.dynamodb.NewImage, 'coventant'),
        cep: ensureString(record.dynamodb.NewImage, 'cep'),
        originCep: ensureString(record.dynamodb.NewImage, 'originCep'),
        meds: ensureString(record.dynamodb.NewImage, 'meds'),
        allergies: ensureString(record.dynamodb.NewImage, 'allergies'),
        ticket: ensureString(record.dynamodb.NewImage, 'ticket'),
        textSession: ensureString(record.dynamodb.NewImage, 'textSession'),
        videoSession: ensureString(ensureMap(record.dynamodb.NewImage, 'videoSession'), 'sessionId'),
        gave_upStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'gave_upStatus'), 'timestamp'),
        cantBeAssistedStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'cantBeAssistedStatus'), 'timestamp'),
        waitingStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'waitingStatus'), 'timestamp'),
        ongoingStatus_doctorUsername: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'doctorUsername'),
        ongoingStatus_doctorName: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'doctorName'),
        ongoingStatus_doctorCrm: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'doctorCrm'),
        ongoingStatus_doctorState: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'doctorState'),
        ongoingStatus_doctorMessage: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'doctorMessage'),
        ongoingStatus_facilityName: ensureString(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'facilityName'),
        ongoingStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'ongoingStatus'), 'timestamp'),
        waiting_kitStatus_doctorUsername: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'doctorUsername'),
        waiting_kitStatus_doctorName: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'doctorName'),
        waiting_kitStatus_doctorCrm: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'doctorCrm'),
        waiting_kitStatus_doctorState: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'doctorState'),
        waiting_kitStatus_doctorMessage: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'doctorMessage'),
        waiting_kitStatus_facilityName: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'facilityName'),
        waiting_kitStatus_receivedAt: ensureNumber(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'receivedAt'),
        waiting_kitStatus_receivedMessage: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'receivedMessage'),
        waiting_kitStatus_sentAt: ensureNumber(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'sentAt'),
        waiting_kitStatus_sentMessage: ensureString(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'sentMessage'),
        waiting_kitStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'waiting_kitStatus'), 'timestamp'),
        finishedStatus_doctorUsername: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'doctorUsername'),
        finishedStatus_doctorName: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'doctorName'),
        finishedStatus_doctorCrm: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'doctorCrm'),
        finishedStatus_doctorState: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'doctorState'),
        finishedStatus_doctorMessage: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'doctorMessage'),
        finishedStatus_facilityName: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'facilityName'),
        finishedStatus_patientOutcome: ensureString(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'patientOutcome'),
        finishedStatus_patientFeedback: ensureNumber(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'patientFeedback'),
        finishedStatus_timestamp: ensureNumber(ensureMap(record.dynamodb.NewImage, 'finishedStatus'), 'timestamp'),
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
