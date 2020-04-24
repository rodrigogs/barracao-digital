const { cloudWatchEvents, lambda } = require('../providers/aws');
const {
  AWS_REGION, AWS_ACCOUNT_ID, STACK_NAME, STAGE, DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES,
} = require('../config');

const alternateDoctorJobFunctionArn = `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${STACK_NAME}-${STAGE}-alternate-doctor-job`;

const repository = {
  async scheduleAlternateDoctorJob(user) {
    const ruleName = `${STACK_NAME}-${STAGE}-alternate-doctor-${user.username}`;
    const rule = await cloudWatchEvents.putRule({
      name: ruleName,
      description: `Alternation schedule for doctor ${user.username}`,
      scheduleExpression: `rate(${DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES} minutes)`,
    });
    await lambda.addPermission({
      action: 'lambda:invokeFunction',
      functionName: alternateDoctorJobFunctionArn,
      sourceArn: rule.RuleArn,
      statementId: `allow-invoke-${ruleName}`,
      principal: 'events.amazonaws.com',
    });
    await cloudWatchEvents.putTargets({
      rule: ruleName,
      targets: [{
        Id: ruleName,
        Arn: alternateDoctorJobFunctionArn,
        Input: JSON.stringify(user),
      }],
    });
  },

  async retrieveCurrentAlternateDoctorJobSchedule(user) {
    try {
      return await cloudWatchEvents.describeRule({
        name: `${STACK_NAME}-${STAGE}-alternate-doctor-${user.username}`,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async removeAlternateDoctorJobSchedule(user) {
    const ruleName = `${STACK_NAME}-${STAGE}-alternate-doctor-${user.username}`;
    await cloudWatchEvents.removeTargets({
      rule: ruleName,
      ids: [ruleName],
      force: true,
    });
    await cloudWatchEvents.deleteRule({
      name: ruleName,
      force: true,
    });
    await lambda.removePermission({
      functionName: alternateDoctorJobFunctionArn,
      statementId: `allow-invoke-${ruleName}`,
    });
  },
};

module.exports = repository;
