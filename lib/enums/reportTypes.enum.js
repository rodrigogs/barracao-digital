const reportTypesEnum = {
  FACILITY_REPORT: 'facility_report',
};

module.exports = {
  ...reportTypesEnum,
  asArray: Object.keys(reportTypesEnum).map((key) => reportTypesEnum[key]),
};
