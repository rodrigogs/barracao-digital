const patientOutcomes = {
  SUSPECT_CASE_HOME_ISOLATION: 'suspect_case_home_isolation',
  SUSPECT_CASE_REFERENCED: 'suspect_case_referenced',
  NON_SUSPECT_CASE: 'non_suspect_case',
  NON_SUSPECT_CASE_REFERENCED: 'non_suspect_case_referenced',
};

module.exports = {
  ...patientOutcomes,
  asArray: Object.keys(patientOutcomes).map((key) => patientOutcomes[key]),
};
