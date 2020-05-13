import { PATIENT_STATUS } from '~/constants'

export default (status) =>
  ({
    [PATIENT_STATUS.WAITING]: {
      text: 'Aguardando',
      color: 'deep-purple'
    },
    [PATIENT_STATUS.WAITING_KIT]: {
      text: 'Kit médico',
      color: 'deep-orange'
    },
    [PATIENT_STATUS.ONGOING]: {
      text: 'Em andamento',
      color: 'green'
    },
    [PATIENT_STATUS.FINISHED]: {
      text: 'Finalizado',
      color: 'light-blue'
    },
    [PATIENT_STATUS.CANT_BE_ASSISTED]: {
      text: 'Sem atendimento',
      color: 'blue-grey'
    },
    [PATIENT_STATUS.GAVE_UP]: {
      text: 'Desistiu',
      color: 'brown'
    }
  }[status] || { text: 'Sem status', color: '' })
