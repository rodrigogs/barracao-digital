const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { FACILITIES_TABLE } = require('../config');

const facilitiesTable = dynamoDB.singleTableDriver(FACILITIES_TABLE);

async function* queryGenerator(type = 'shed') {
  let Items;
  let LastEvaluatedKey;
  do {
    ({ Items, LastEvaluatedKey } = await dynamoDB.query({
      TableName: FACILITIES_TABLE,
      IndexName: 'type',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': type,
      },
      LastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
    yield* Items;
  } while (LastEvaluatedKey);
}

const repository = {
  async create({
    origin,
    type = 'shed',
    contact,
    contactType = 'email',
  }) {
    const facility = {
      id: uuid(),
      origin,
      destination: origin,
      type,
      contact,
      contactType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: facility,
    }).promise();

    return facility;
  },

  async update(facility) {
    const updatedFacility = {
      ...facility,
      destination: facility.origin,
      updatedAt: Date.now(),
    };

    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: facility,
    }).promise();

    return updatedFacility;
  },

  async addOriginDestination(origin, destination) {
    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: {
        origin,
        destination,
        type: 'destination',
      },
    }).promise();
  },

  async getAll() {
    const results = [];
    for await (const facility of queryGenerator()) {
      results.push({ ...facility, destination: undefined });
    }
    return results;
  },

  async getOneByOrigin(origin) {
    return dynamoDB.get({
      TableName: FACILITIES_TABLE,
      Key: {
        origin,
        destination: origin,
      },
    }).promise().then((result) => result.Item);
  },

  async getAllByOrigin(origin) {
    return facilitiesTable.query({
      partition: origin,
      partitionName: 'origin',
    });
  },

  async getAllDestinationsByOrigin(origin) {
    const facilities = await facilitiesTable.query({
      partition: origin,
      partitionName: 'origin',
    });
    return facilities.map((facility) => facility.destination);
  },

  async getOneByDestination(destination) {
    const { Items } = await dynamoDB.query({
      TableName: FACILITIES_TABLE,
      IndexName: 'destinationOrigin',
      KeyConditionExpression: '#destination = :destination',
      ExpressionAttributeNames: {
        '#destination': 'destination',
      },
      ExpressionAttributeValues: {
        ':destination': destination,
      },
      Limit: 1,
    }).promise();
    console.log(JSON.stringify(Items, null, 2));
    return Items[0];
  },
};

module.exports = repository;
