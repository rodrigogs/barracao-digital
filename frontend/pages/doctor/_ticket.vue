<template>
  <div>
    <DoctorPatientStatusModal
      :patient="patient"
      :save="savePatient"
      :start-session="createOpentokSession"
      @close="modalClosed"
    />

    <ConversationSession
      v-if="hasOpentokCredentials"
      :origin-cep="patient.originCep"
      :doctor-username="$auth.user.username"
      :patient-ticket="patient.ticket"
      :is-video-allowed="true"
      :is-publisher="true"
      @close="isConversationOpen = false"
    />
  </div>
</template>

<script>
import DoctorPatientStatusModal from '@/components/doctor/DoctorPatientStatusModal'
import ConversationSession from '@/components/conversation'

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    DoctorPatientStatusModal,
    ConversationSession
  },
  asyncData({ app, store, params, error }) {
    const storePatient = store.getters['worklist/getPatient'](params.ticket)
    if (storePatient) return Promise.resolve({ patient: storePatient })

    return store.dispatch('worklist/fetchPatient', params.ticket).then(
      (patient) => ({ patient }),
      () => error({ message: 'Usuário Inexistente', statusCode: 404 })
    )
  },
  computed: {
    videoSession() {
      return (
        this.$auth.user &&
        this.$auth.user.videoSessions &&
        this.$auth.user.videoSessions[this.patient.ticket]
      )
    },
    hasOpentokCredentials() {
      return (
        this.videoSession &&
        this.videoSession.sessionId &&
        this.videoSession.token
      )
    }
  },
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
          },
          (error) => {
            this.$toast.error(
              'Não foi possível alterar o status do paciente, tente novamente mais tarde.'
            )
            return Promise.reject(error)
          }
        )
    },
    async createOpentokSession() {
      const videoSession =
        this.$auth.user.videoSessions &&
        this.$auth.user.videoSessions[this.$route.params.ticket]
      if (videoSession) {
        await this.$api.deleteVideoSession(this.patient.ticket)
      }
      return this.$api.createVideoSession(this.patient.ticket)
    },
    modalClosed() {
      this.$router.push({ name: 'doctor' })
    }
  }
}
</script>
