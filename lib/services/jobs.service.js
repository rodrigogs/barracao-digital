import jobsRepository from '../repository/jobs.repository'

const service = {
  async scheduleAlternateDoctorJob(user) {
    return jobsRepository.scheduleAlternateDoctorJob(user)
  },

  async retrieveCurrentAlternateDoctorJobSchedule(user) {
    return jobsRepository.retrieveCurrentAlternateDoctorJobSchedule(user)
  },

  async removeAlternateDoctorJobSchedule(user) {
    return jobsRepository.removeAlternateDoctorJobSchedule(user)
  },
}

export default service
