const authService = require('./auth.service.js');
const doctorsService = require('./doctors.service.js');
const patientsService = require('./patients.service.js');
const facilitiesService = require('./facilities.service');
const jobsService = require('./jobs.service');
const conversationService = require('./conversation.service');
const configsService = require('./configs.service');
const reportsService = require('./reports.service');

module.exports = {
  authService,
  doctorsService,
  patientsService,
  facilitiesService,
  jobsService,
  conversationService,
  configsService,
  reportsService,
};
