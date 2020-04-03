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
    const hasVersion = attributes.version !== null && attributes.version !== undefined;
    const currentVersion = hasVersion ? attributes.version : 0;
    const nextVersion = Number(currentVersion) + 1;
    const shouldLock = lock && hasVersion;

    const ConditionExpression = shouldLock ? '#version = :expectedVersion' : undefined;
    const ExpressionAttributeNames = shouldLock ? { '#version': 'version' } : undefined;
    const ExpressionAttributeValues = shouldLock ? { ':expectedVersion': currentVersion } : undefined;

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
    partition, partitionName, sort, sortName, limit,
  }) {
    const items = [];
    for await (const item of singleTableDriver(tableName).queryGenerator({
      partition, partitionName, sort, sortName, limit,
    })) {
      items.push(item);
    }
    return items;
  },

  queryGenerator: async function* queryGenerator({
    partition,
    partitionName = 'partition',
    sort,
    sortName = 'sort',
    limit,
  }) {
    const KeyConditionExpression = sort
      ? '#partition = :partition AND BEGINS_WITH(#sort, :sort)'
      : '#partition = :partition';

    const ExpressionAttributeNames = {
      '#partition': partitionName,
      '#sort': sort ? sortName : undefined,
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
