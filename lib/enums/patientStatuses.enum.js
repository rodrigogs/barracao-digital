const patientStatuses = {
  WAITING: 'waiting',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
  WAITING_KIT: 'waiting_kit',
  CANT_BE_ASSISTED: 'cant_be_assisted',
  FACILITY_NOT_AVAILABLE: 'facility_not_available',
  GAVE_UP: 'gave_up',
};

module.exports = {
  ...patientStatuses,
  asArray: Object.keys(patientStatuses).map((key) => patientStatuses[key]),
};
