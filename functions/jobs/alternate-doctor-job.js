const { jobsService, doctorsService } = require('../../lib/services');

module.exports.handler = async (user) => {
  const currentUser = await doctorsService.getOneByUsername(user.username);
  if (currentUser.active) await doctorsService.alternateActive(user.username);
  await jobsService.removeAlternateDoctorJobSchedule(user);
};
