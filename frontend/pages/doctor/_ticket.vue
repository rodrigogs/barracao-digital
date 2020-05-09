<template>
  <div>
    <DoctorPatientStatusModal
      :patient="patient"
      :save="savePatient"
      :start-session="createConversationSession"
      @close="modalClosed"
    />

    <ConversationSession
      v-if="hasActiveConversation"
      :origin-cep="patient.originCep"
      :doctor-username="$auth.user.username"
      :patient-ticket="patient.ticket"
      :is-video-allowed="!!videoSession"
      :is-doctor="true"
    />
  </div>
</template>

<script>
import DoctorPatientStatusModal from '@/components/doctor/DoctorPatientStatusModal'
import ConversationSession from '@/components/conversation/ConversationSession'

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    DoctorPatientStatusModal,
    ConversationSession
  },
  asyncData({ app, params, error }) {
    return app.$api.searchPatientByTicket(params.ticket).then(
      (patient) => ({ patient }),
      () => error({ message: 'Usuário Inexistente', statusCode: 404 })
    )
  },
  data: () => ({
    patientSubscription: null
  }),
  computed: {
    hasActiveConversation() {
      return !!this.videoSession || !!this.textSession
    },
    textSession() {
      return this.patient.textSession
    },
    videoSession() {
      return (
        this.$auth.user &&
        this.$auth.user.videoSessions &&
        this.$auth.user.videoSessions[this.patient.ticket]
      )
    }
  },
  mounted() {
    this.patientSubscription = this.$fireStore
      .collection('facilities')
      .doc(this.patient.originCep)
      .collection('patients')
      .doc(this.patient.ticket)
      .onSnapshot((doc) => {
        this.patient = doc.data()
      })
  },
  beforeDestroy() {
    this.patientSubscription && this.patientSubscription()
  },
  methods: {
    savePatient({ status, form }) {
      return this.$api
        .setPatientStatus(this.patient.ticket, {
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
    async createConversationSession({ text, video }) {
      if (this.hasActiveConversation) {
        await this.$api.deleteConversationSession(this.patient.ticket)
      }
      return this.$api.createConversationSession(this.patient.ticket, {
        text,
        video
      })
    },
    modalClosed() {
      this.$router.push({ name: 'doctor' })
    }
  }
}
</script>
