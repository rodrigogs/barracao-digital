const { v4: uuid } = require('uuid');
const { dynamoDB } = require('../providers');
const { FACILITIES_TABLE } = require('../config');

const parseDynamoQueryResult = (results) => {
  const items = results.Items;
  const lastEvaluatedKey = results.LastEvaluatedKey;

  return {
    items,
    lastEvaluatedKey,
  };
};

const facilitiesTable = dynamoDB.singleTableDriver(FACILITIES_TABLE);

const getValidFields = ({
  type = 'shed',
  origin,
  name,
  techDirector,
  contact,
}) => ({
  type,
  origin,
  name,
  techDirector,
  contact,
});

const repository = {
  async create(object) {
    const fileds = getValidFields(object);
    const facility = {
      id: uuid(),
      origin: fileds.origin,
      destination: fileds.origin,
      name: fileds.name,
      type: fileds.type,
      contact: fileds.contact,
      techDirector: fileds.techDirector,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 0,
    };

    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: facility,
    }).promise();

    return facility;
  },

  async update(facility) {
    const fields = getValidFields(facility);
    const updatedFacility = {
      ...fields,
      destination: facility.origin,
      updatedAt: Date.now(),
      createdAt: facility.createdAt,
      version: facility.version + 1,
    };

    await dynamoDB.put({
      TableName: FACILITIES_TABLE,
      Item: updatedFacility,
      ConditionExpression: '#version = :expectedVersion',
      ExpressionAttributeNames: {
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':expectedVersion': facility.version,
      },
    }).promise();

    return updatedFacility;
  },

  async delete(origin) {
    const storedFacility = await repository.getOneByOrigin(origin);
    if (!storedFacility) return;

    await dynamoDB.delete({
      TableName: FACILITIES_TABLE,
      Key: { origin, destination: origin },
      ConditionExpression: '#version = :expectedVersion',
      ExpressionAttributeNames: {
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':expectedVersion': storedFacility.version,
      },
    }).promise();
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

  async removeOriginDestination(origin, destination) {
    await dynamoDB.delete({
      TableName: FACILITIES_TABLE,
      Key: { origin, destination },
    }).promise();
  },

  async getAll(type = 'shed', { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(await dynamoDB.query({
      TableName: FACILITIES_TABLE,
      IndexName: 'type',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': type,
      },
      Limit: pageSize > 20 ? 20 : pageSize,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
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
