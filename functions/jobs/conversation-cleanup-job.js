const { jobsService, conversationService } = require('barracao-digital/services');

module.exports.handler = async ({ doctorUsername, patientTicket }) => {
  try {
    await conversationService.removeSession(doctorUsername, patientTicket);
  } catch (err) {
    console.error('Error removing conversation session', err);
  }
  try {
    await jobsService.removeConversationCleanupJobSchedule({ doctorUsername, patientTicket });
  } catch (err) {
    console.error('Error removing job schedule', err);
  }
};
