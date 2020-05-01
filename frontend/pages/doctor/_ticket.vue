<template>
  <div>
    <DoctorPatientStatusModal
      :patient="patient"
      :save="savePatient"
      :start-session="createOpentokSession"
      @close="modalClosed"
    />

    <OpentokSession
      v-if="hasOpentokCredentials"
      :session-id="videoSession.sessionId"
      :token="videoSession.token"
      :end-session="deleteOpentokSession"
    />
  </div>
</template>

<script>
import DoctorPatientStatusModal from '@/components/doctor/DoctorPatientStatusModal'
import OpentokSession from '@/components/opentok/OpentokSession.vue'

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    DoctorPatientStatusModal,
    OpentokSession
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
    videoSession: null
  }),
  computed: {
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
    createOpentokSession() {
      const videoSession =
        this.$auth.user.videoSessions &&
        this.$auth.user.videoSessions[this.$route.params.ticket]
      if (videoSession) {
        this.videoSession = videoSession
        return Promise.resolve(videoSession)
      }

      return this.$api
        .createVideoSession(this.patient.ticket)
        .then(({ sessionId, token }) => {
          this.videoSession = {
            sessionId,
            token
          }
        })
    },
    deleteOpentokSession() {
      return this.$api.deleteVideoSession(this.patient.ticket).then(() => {
        this.videoSession = null
      })
    },
    modalClosed() {
      this.$router.push({ name: 'doctor' })
    }
  }
}
</script>
