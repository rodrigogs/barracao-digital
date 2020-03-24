const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const singleTableDriver = (tableName) => ({
  async get({ partition, sort }) {
    return dynamoDB.get({
      TableName: tableName,
      Key: {
        __pk: partition,
        __sk: sort,
      },
    }).promise().then((response) => response.Item);
  },

  async put({ partition, sort, item }) {
    return dynamoDB.put({
      TableName: tableName,
      Item: {
        ...item,
        __pk: partition,
        __sk: sort,
      },
    }).promise();
  },

  async query({
    partition, sort, filter, limit,
  }) {
    const items = [];
    for await (const item of singleTableDriver(tableName).queryGenerator({
      partition, sort, limit, filter,
    })) {
      items.push(item);
    }
    return items;
  },

  queryGenerator: async function* queryGenerator({
    partition, sort, filter, limit = 0,
  }) {
    const KeyConditionExpression = sort
      ? '#partition = :partition AND BEGINS_WITH(#sort, :sort)'
      : '#partition = :partition';

    const FilterExpression = (filter)
      ? 'CONTAINS(#sort, :filter)'
      : undefined;

    const ExpressionAttributeNames = {
      '#partition': '__pk',
      '#sort': '__sk',
    };

    const ExpressionAttributeValues = {
      ':partition': partition,
      ':sort': sort,
      ':filter': filter,
    };

    let Items;
    let LastEvaluatedKey;
    do {
      ({ Items, LastEvaluatedKey } = await dynamoDB.query({
        TableName: tableName,
        KeyConditionExpression,
        FilterExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        Limit: limit,
        LastEvaluatedKey,
        ScanIndexForward: true,
      }).promise());
      yield* Items;
    } while (LastEvaluatedKey);
  },

  delete({ partition, sort }) {
    return dynamoDB.delete({
      TableName: tableName,
      Key: {
        __pk: partition,
        __sk: sort,
      },
    }).promise();
  },
});

module.exports = dynamoDB;
module.exports.singleTableDriver = singleTableDriver;
