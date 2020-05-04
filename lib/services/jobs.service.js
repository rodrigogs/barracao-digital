const jobsRepository = require('../repository/jobs.repository');

module.exports = {
  async scheduleAlternateDoctorJob(user) {
    return jobsRepository.scheduleAlternateDoctorJob(user);
  },

  async retrieveCurrentAlternateDoctorJobSchedule(user) {
    return jobsRepository.retrieveCurrentAlternateDoctorJobSchedule(user);
  },

  async removeAlternateDoctorJobSchedule(user) {
    return jobsRepository.removeAlternateDoctorJobSchedule(user);
  },

  async scheduleConversationCleanupJob({ doctorUsername, patientTicket }) {
    return jobsRepository.scheduleConversationCleanupJob({ doctorUsername, patientTicket });
  },

  async retrieveConversationCleanupJobSchedule({ doctorUsername, patientTicket }) {
    return jobsRepository.retrieveConversationCleanupJobSchedule({ doctorUsername, patientTicket });
  },

  async removeConversationCleanupJobSchedule({ doctorUsername, patientTicket }) {
    return jobsRepository.removeConversationCleanupJobSchedule({ doctorUsername, patientTicket });
  },
};
