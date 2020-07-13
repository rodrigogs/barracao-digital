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
};
