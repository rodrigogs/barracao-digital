export const WAITING = 'waiting'
export const ONGOING = 'ongoing'
export const FINISHED = 'finished'
export const WAITING_KIT = 'waiting_kit'
export const CANT_BE_ASSISTED = 'cant_be_assisted'
export const FACILITY_NOT_AVAILABLE = 'facility_not_available'
export const GAVE_UP = 'gave_up'

const patientStatuses = {
  WAITING,
  ONGOING,
  FINISHED,
  WAITING_KIT,
  CANT_BE_ASSISTED,
  FACILITY_NOT_AVAILABLE,
  GAVE_UP,
}

export default patientStatuses

export const asArray = Object.keys(patientStatuses).map((key) => patientStatuses[key])
