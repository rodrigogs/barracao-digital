const { STS } = require('aws-sdk');
const sts = new STS();

module.exports.getAccountId = async () => {
  const { Account } = await sts.getCallerIdentity().promise();
  return Account;
};
