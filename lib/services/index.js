const authService = require('./auth.service.js');
const doctorsService = require('./doctors.service.js');
const patientsService = require('./patients.service.js');
const facilitiesService = require('./facilities.service');
const configsService = require('./configs.service');

module.exports = {
  authService,
  doctorsService,
  patientsService,
  facilitiesService,
  configsService,
};
