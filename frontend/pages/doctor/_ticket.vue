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
  data: () => ({
    chatSession: null,
    chatSessionSubscription: null
  }),
  computed: {
    hasActiveConversation() {
      return this.hasOpentokCredentials || this.hasActiveChat
    },
    hasActiveChat() {
      return !!this.chatSession
    },
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
  mounted() {
    this.chatSessionSubscription = this.$fireStore
      .collection('facilities')
      .doc(this.patient.originCep)
      .collection('conversations')
      .doc(`${this.$auth.user.username}#${this.patient.ticket}`)
      .onSnapshot((doc) => {
        this.chatSession = doc.data()
      })
  },
  beforeDestroy() {
    this.chatSessionSubscription && this.chatSessionSubscription()
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
