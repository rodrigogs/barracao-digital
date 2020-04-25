const { cloudWatchEvents, lambda } = require('../providers/aws');
const {
  AWS_REGION, AWS_ACCOUNT_ID, STACK_NAME, STAGE, DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES,
} = require('../config');

const alternateDoctorJobFunctionArn = `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${STACK_NAME}-${STAGE}-alternate-doctor-job`;

const buildCron = (minutesFromNow) => {
  const millisecondsFromNow = minutesFromNow * 60 * 1000;
  const now = Date.now();
  const future = new Date(now + millisecondsFromNow);

  const minute = future.getMinutes();
  const hour = future.getHours();
  const dayOfMonth = future.getDate();
  const month = future.getMonth() + 1;
  const year = future.getFullYear();

  return `cron(${minute} ${hour} ${dayOfMonth} ${month} ? ${year})`;
};

const repository = {
  async scheduleAlternateDoctorJob(user) {
    const ruleName = `${STACK_NAME}-${STAGE}-alternate-doctor-${user.username}`;
    const rule = await cloudWatchEvents.putRule({
      name: ruleName,
      description: `Alternation schedule for doctor ${user.username}`,
      scheduleExpression: buildCron(DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES),
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
