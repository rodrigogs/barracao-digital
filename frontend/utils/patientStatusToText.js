import { PATIENT_STATUS } from '~/constants'

export default (status) =>
  ({
    [PATIENT_STATUS.WAITING]: {
      text: 'Aguardando',
      color: ''
    },
    [PATIENT_STATUS.WAITING_KIT]: {
      text: 'Aguardando kit',
      color: ''
    },
    [PATIENT_STATUS.ONGOING]: {
      text: 'Em andamento',
      color: ''
    },
    [PATIENT_STATUS.FINISHED]: {
      text: 'Finalizado',
      color: ''
    },
    [PATIENT_STATUS.CANT_BE_ASSISTED]: {
      text: 'Sem atendimento',
      color: ''
    },
    [PATIENT_STATUS.GAVE_UP]: {
      text: 'Desistiu',
      color: ''
    }
  }[status] || { text: 'Sem status', color: '' })
