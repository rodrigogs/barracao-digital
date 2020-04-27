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

  async scheduleVideoCallCleanupJob({ doctorUsername, patientTicket }) {
    return jobsRepository.scheduleVideoCallCleanupJob({ doctorUsername, patientTicket });
  },

  async retrieveVideoCallCleanupJobSchedule({ doctorUsername, patientTicket }) {
    return jobsRepository.retrieveVideoCallCleanupJobSchedule({ doctorUsername, patientTicket });
  },

  async removeVideoCallCleanupJobSchedule({ doctorUsername, patientTicket }) {
    return jobsRepository.removeVideoCallCleanupJobSchedule({ doctorUsername, patientTicket });
  },
};
