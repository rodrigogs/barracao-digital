<template>
  <DoctorPatientStatusModal
    :patient="patient"
    :save="savePatient"
    :session="session"
    @close="modalClosed"
  />
</template>

<script>
import OT from '@opentok/client'
import DoctorPatientStatusModal from '@/components/doctor/DoctorPatientStatusModal'

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    DoctorPatientStatusModal
  },
  asyncData({ app, store, params, error }) {
    const storePatient = store.getters['worklist/getPatient'](params.ticket)
    if (storePatient) return Promise.resolve({ patient: storePatient })

    return store.dispatch('worklist/fetchPatient', params.ticket).then(
      (patient) => ({ patient }),
      () => error({ message: 'Usuário Inexistente', statusCode: 404 })
    )
  },
  data: () => ({
    session: null
  }),
  methods: {
    savePatient({ status, form, next }) {
      return this.$store
        .dispatch('worklist/savePatientStatus', {
          ticket: this.patient.ticket,
          status,
          form
        })
        .then(
          (patient) => {
            this.$toast.success('Status do paciente alterado com sucesso.')
            this.patient = patient
            this.createOpentokSession(patient)
          },
          (error) => {
            this.$toast.error(
              'Não foi possível alterar o status do paciente, tente novamente mais tarde.'
            )
            return Promise.reject(error)
          }
        )
    },
    createOpentokSession(patient) {
      return this.$api
        .createVideoSession(patient.ticket)
        .then((videoSession) => {
          this.session = OT.initSession(
            videoSession.apiKey,
            videoSession.sessionId
          )
          this.session.connect(videoSession.token, (err) => {
            if (err) {
              this.$sentry.captureException(err)
            }
          })
        })
    },
    modalClosed() {
      this.$router.push({ name: 'doctor' })
    }
  }
}
</script>
