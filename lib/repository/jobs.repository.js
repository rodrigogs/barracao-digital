const { cloudWatchEvents, lambda } = require('../providers/aws');
const {
  AWS_REGION,
  AWS_ACCOUNT_ID,
  STACK_NAME,
  STAGE,
  DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES,
  VIDEO_CALL_CLEANUP_TIMEOUT_IN_MINUTES,
} = require('../config');
const { isObject } = require('../helpers/object.helper');

const alternateDoctorJobFunctionArn = `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${STACK_NAME}-${STAGE}-alternate-doctor-job`;
const videoCallCleanupJobFunctionArn = `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${STACK_NAME}-${STAGE}-video-call-cleanup-job`;

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

// eslint-disable-next-line consistent-return
const removeJobSchedule = async ({ ruleName, functionName, ignoreErrors = false }) => {
  try {
    console.info(`${ruleName}: removing target`);
    await cloudWatchEvents.removeTargets({
      rule: ruleName,
      ids: [ruleName],
      force: true,
    });
  } catch (err) {
    if (ignoreErrors) {
      console.error('scheduleJob', 'This should be harmless:', err);
    } else {
      throw err;
    }
  }
  try {
    const statementId = `allow-invoke-${ruleName}`;
    console.info(`${ruleName}: removing "${statementId}" permission from lambda "${functionName}"`);
    await lambda.removePermission({
      functionName,
      statementId: `allow-invoke-${ruleName}`,
    });
  } catch (err) {
    if (ignoreErrors) {
      console.error('scheduleJob', 'This should be harmless:', err);
    } else {
      throw err;
    }
  }
  try {
    console.info(`${ruleName}: deleting rule`);
    await cloudWatchEvents.deleteRule({
      name: ruleName,
      force: true,
    });
  } catch (err) {
    if (ignoreErrors) {
      console.error('scheduleJob', 'This should be harmless:', err);
    } else {
      throw err;
    }
  }
};

const scheduleJob = async ({
  ruleName,
  ruleDescription,
  functionName,
  timeoutInMinutes,
  input,
}) => {
  await removeJobSchedule({ ruleName, functionName, ignoreErrors: true }); // Just in case...
  console.info(`${ruleName}: creating rule`);
  const rule = await cloudWatchEvents.putRule({
    name: ruleName,
    description: ruleDescription,
    scheduleExpression: buildCron(timeoutInMinutes),
  });
  const statementId = `allow-invoke-${ruleName}`;
  console.info(`${ruleName}: adding "${statementId}" permission to lambda "${functionName}"`);
  await lambda.addPermission({
    action: 'lambda:invokeFunction',
    functionName,
    statementId,
    sourceArn: rule.RuleArn,
    principal: 'events.amazonaws.com',
  });
  console.info(`${ruleName}: creating rule target`);
  await cloudWatchEvents.putTargets({
    rule: ruleName,
    targets: [{
      Id: ruleName,
      Arn: functionName,
      Input: isObject(input) ? JSON.stringify(input) : input,
    }],
  });
};

const retrieveJobSchedule = async ({ ruleName }) => {
  try {
    return await cloudWatchEvents.describeRule({ name: ruleName });
  } catch (err) {
    console.error('retrieveJobSchedule', 'this should be harmless:', err);
    return null;
  }
};

const repository = {
  // Doctors
  async scheduleAlternateDoctorJob(user) {
    const ruleName = `alternate-doctor-job-${user.username}`;
    console.info(`Creating rule: ${ruleName}`);
    await scheduleJob({
      ruleName,
      ruleDescription: `Alternation schedule for doctor ${user.username}`,
      functionName: alternateDoctorJobFunctionArn,
      input: user,
      timeoutInMinutes: DOCTOR_INACTIVITY_TIMEOUT_IN_MINUTES,
    });
  },

  async retrieveCurrentAlternateDoctorJobSchedule(user) {
    await retrieveJobSchedule({ ruleName: `alternate-doctor-job-${user.username}` });
  },

  async removeAlternateDoctorJobSchedule(user) {
    const ruleName = `alternate-doctor-job-${user.username}`;
    console.info(`Deleting rule: ${ruleName}`);
    await removeJobSchedule({
      ruleName,
      functionName: alternateDoctorJobFunctionArn,
    });
  },
  // Video calls
  async scheduleVideoCallCleanupJob({ doctorUsername, patientTicket }) {
    const ruleName = `video-call-cleanup-job-${doctorUsername}-${patientTicket}`;
    console.info(`Creating rule: ${ruleName}`);
    await scheduleJob({
      ruleName,
      ruleDescription: `Verify, terminate and cleanup any video remains like session id configs for doctor ${doctorUsername} and patient ${patientTicket}`,
      functionName: videoCallCleanupJobFunctionArn,
      input: { doctorUsername, patientTicket },
      timeoutInMinutes: VIDEO_CALL_CLEANUP_TIMEOUT_IN_MINUTES,
    });
  },

  async retrieveVideoCallCleanupJobSchedule({ doctorUsername, patientTicket }) {
    await retrieveJobSchedule({ ruleName: `video-call-cleanup-job-${doctorUsername}-${patientTicket}` });
  },

  async removeVideoCallCleanupJobSchedule({ doctorUsername, patientTicket }) {
    const ruleName = `video-call-cleanup-job-${doctorUsername}-${patientTicket}`;
    console.info(`Deleting rule: ${ruleName}`);
    await removeJobSchedule({
      ruleName,
      functionName: videoCallCleanupJobFunctionArn,
    });
  },
};

module.exports = repository;
