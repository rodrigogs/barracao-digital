const { REPORTS_TABLE } = require('../config');
const dynamoDB = require('../providers/aws/dynamoDB');
const reportDimensions = require('../enums/reportDimensions.enum');

const reportsTable = dynamoDB.singleTableDriver(REPORTS_TABLE);

const repository = {
  feedMetric(metric) {

  },

  getMetric(metric, from, to) {

  },
};

module.exports = repository;
