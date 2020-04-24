const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

const addPermission = async ({
  action,
  functionName,
  statementId,
  principal,
  sourceArn,
}) => lambda.addPermission({
  Action: action,
  FunctionName: functionName,
  StatementId: statementId,
  Principal: principal,
  SourceArn: sourceArn,
}).promise();

const removePermission = async ({
  functionName,
  statementId,
}) => lambda.removePermission({
  FunctionName: functionName,
  StatementId: statementId,
}).promise();

module.exports = {
  addPermission,
  removePermission,
};
