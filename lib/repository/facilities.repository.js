const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { FACILITIES_TABLE } = require('../config');

const facilitiesTable = dynamoDB.singleTableDriver(FACILITIES_TABLE);

const repository = {
  async create({
    origin,
    type = 'default',
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

  async addOriginDestination(origin, destination) {
    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: {
        origin,
        destination,
      },
    }).promise();
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
    const { Items } = dynamoDB.query({
      TableName: FACILITIES_TABLE,
      IndexName: 'destinationOrigin',
      KeyConditionExpression: '#destination = :destination',
      ExpressionAttributeNames: {
        '#destination': 'destination',
      },
      ExpressionAttributeValues: {
        ':destination': destination,
      },
      Limit: 2,
    }).promise();

    if (Items.length > 1) throw new Error(`Duplicated destination "${destination}"!`);

    return Items[0];
  },
};

module.exports = repository;
