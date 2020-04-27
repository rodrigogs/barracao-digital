const { jobsService, videoChatService } = require('barracao-digital/services');

module.exports.handler = async ({ doctorUsername, patientTicket }) => {
  try {
    await videoChatService.removeVideoSession(doctorUsername, patientTicket);
  } catch (err) {
    console.error('Error removing video session', err);
  }
  try {
    await jobsService.removeVideoCallCleanupJobSchedule({ doctorUsername, patientTicket });
  } catch (err) {
    console.error('Error removing job schedule', err);
  }
};
