const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const singleTableDriver = (tableName) => ({
  async get({ partition, sort }) {
    return dynamoDB.get({
      TableName: tableName,
      Key: {
        partition,
        sort,
      },
    }).promise().then((response) => response.Item);
  },

  async put({
    partition,
    sort,
    lock,
    ...attributes
  }) {
    const currentVersion = Number(attributes.version) || 0;
    const nextVersion = currentVersion + 1;

    const ConditionExpression = lock ? '#version = :expectedVersion' : undefined;
    const ExpressionAttributeNames = lock ? { '#version': 'version' } : undefined;
    const ExpressionAttributeValues = lock ? { ':expectedVersion': currentVersion } : undefined;

    const item = {
      ...attributes,
      version: nextVersion,
      partition,
      sort,
    };

    await dynamoDB.put({
      TableName: tableName,
      Item: item,
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    }).promise();

    return item;
  },

  async query({
    partition, sort, limit,
  }) {
    const items = [];
    for await (const item of singleTableDriver(tableName).queryGenerator({
      partition, sort, limit,
    })) {
      items.push(item);
    }
    return items;
  },

  queryGenerator: async function* queryGenerator({
    partition, sort, limit = 0,
  }) {
    const KeyConditionExpression = sort
      ? '#partition = :partition AND BEGINS_WITH(#sort, :sort)'
      : '#partition = :partition';

    const ExpressionAttributeNames = {
      '#partition': 'partition',
      '#sort': 'sort',
    };

    const ExpressionAttributeValues = {
      ':partition': partition,
      ':sort': sort,
    };

    let Items;
    let LastEvaluatedKey;
    do {
      ({ Items, LastEvaluatedKey } = await dynamoDB.query({
        TableName: tableName,
        KeyConditionExpression,
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
        partition,
        sort,
      },
    }).promise();
  },
});

module.exports = dynamoDB;
module.exports.singleTableDriver = singleTableDriver;
