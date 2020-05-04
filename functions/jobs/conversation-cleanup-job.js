const { jobsService, conversationService, doctorsService } = require('barracao-digital/services');

module.exports.handler = async ({ doctorUsername, patientTicket }) => {
  try {
    const doctor = await doctorsService.getOneByUsername(doctorUsername);
    await conversationService.removeSession(doctor.cep, doctorUsername, patientTicket);
  } catch (err) {
    console.error('Error removing conversation session', err);
  }
  try {
    await jobsService.removeConversationCleanupJobSchedule({ doctorUsername, patientTicket });
  } catch (err) {
    console.error('Error removing job schedule', err);
  }
};
