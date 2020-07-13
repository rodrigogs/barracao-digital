export const SUSPECT_CASE_HOME_ISOLATION = 'suspect_case_home_isolation'
export const SUSPECT_CASE_REFERENCED = 'suspect_case_referenced'
export const NON_SUSPECT_CASE = 'non_suspect_case'
export const NON_SUSPECT_CASE_REFERENCED = 'non_suspect_case_referenced'

const patientOutcomes = {
  SUSPECT_CASE_HOME_ISOLATION,
  SUSPECT_CASE_REFERENCED,
  NON_SUSPECT_CASE,
  NON_SUSPECT_CASE_REFERENCED,
}

export const asArray = () => Object.keys(patientOutcomes).map((key) => patientOutcomes[key])

export default patientOutcomes
