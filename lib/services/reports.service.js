const dispatch = require('./dispatcher');
// const reportsRepository = require('../repository/reports.repository');
const { REPORT_TYPES } = require('../enums');

const compileFacilityReport = async (params) => {
  const report = {};
  const facility = await dispatch('facilities', 'getOneByOrigin')(params.origin);

  return report;
};

const reportFactory = (type) => ({
  [REPORT_TYPES.FACILITY_REPORT]: compileFacilityReport,
})[type];

module.exports = {
  createReport(type, params) {
    return reportFactory(type)(params);
  },

  feedMetric(metric, key) {

  },
};
