<template>
  <v-card tile flat width="100%">
    <div v-if="isFullyLoaded" class="conversation">
      <div
        v-if="patientVideoSession"
        class="conversation__video grey lighten-3"
      >
        <ConversationVideo
          v-if="videoSession && (isDoctor || isVideoAuthorized)"
          :key="videoKey"
          ref="video"
          :session-id="videoSession.sessionId"
          :token="videoSession.token"
          :is-publisher="isDoctor"
          @video-ready="setVideoReady"
          @disconnection="deleteVideoSession"
        />
      </div>

      <ConversationChat
        class="conversatios__chat"
        :doctor="doctor"
        :patient="patient"
        :is-doctor="isDoctor"
      />
    </div>
    <div v-else>
      <v-overlay absolute :opacity="0.5">
        <v-icon color="orange lighten-2">
          mdi-loading
        </v-icon>
      </v-overlay>
    </div>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import promiseDelay from '~/utils/promiseDelay'
import ConversationVideo from '~/components/conversation/ConversationVideo'
import ConversationChat from '~/components/conversation/ConversationChat'

export default {
  name: 'ConversationSession',
  components: {
    ConversationVideo,
    ConversationChat,
  },
  props: {
    originCep: {
      type: String,
      required: true,
    },
    doctorUsername: {
      type: String,
      required: true,
    },
    patientTicket: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    isVideoReady: false,
    isPatientVideoAllowed: true,
    patient: null,
    doctor: null,
    doctorSubscription: null,
    patientSubscription: null,
    isVideoAuthorized: false,
    videoKey: Math.random(),
  }),
  computed: {
    videoSession() {
      return this.isDoctor ? this.doctorVideoSession : this.patientVideoSession
    },
    doctorTextSession() {
      return this.doctor && this.doctor.textSessions[this.patientTicket]
    },
    doctorVideoSession() {
      return this.doctor && this.doctor.videoSessions[this.patientTicket]
    },
    patientTextSession() {
      return this.patient && this.patient.textSession
    },
    patientVideoSession() {
      return this.patient && this.patient.videoSession
    },
    isFullyLoaded() {
      return this.doctor && this.patient
    },
    talkingWith() {
      return this.isDoctor
        ? this.patient && this.patient.name
        : this.doctor && this.doctor.name
    },
  },
  watch: {
    videoSession(newVideoSession, oldVideoSession) {
      if (!newVideoSession) this.isVideoAuthorized = false
      if (!newVideoSession || !oldVideoSession) return
      if (oldVideoSession.sessionId === newVideoSession.sessionId) return
      this.videoKey = Math.random()
    },
    async patientVideoSession(hasSession, hadSession) {
      const wasSessionCreated = !hadSession && hasSession
      await promiseDelay(2000)
      if (!this.doctorVideoSession && !this.isDoctor) {
        return this.deleteVideoSession(false)
      }
      if (wasSessionCreated && !this.isDoctor) {
        this.isVideoAuthorized = false
        return this.confirmVideoChat()
      }
    },
  },
  async mounted() {
    try {
      await this.syncData()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      this.$sentry.captureException(err)
      this.$nuxt.error(err)
    }
  },
  async destroyed() {
    this.$refs.video && (await this.$refs.video.disconnect())
    this.doctorSubscription && (await this.doctorSubscription())
    this.patientSubscription && (await this.patientSubscription())
  },
  methods: {
    ...mapActions('chat', {
      sendChatMessage: 'sendMessage',
      informPatientCanceledVideo: 'informPatientCanceledVideo',
    }),
    async syncData() {
      const facilityRef = this.$fireStore
        .collection('facilities')
        .doc(this.originCep)

      const doctorRef = facilityRef
        .collection('doctors')
        .doc(this.doctorUsername)

      const patientRef = facilityRef
        .collection('patients')
        .doc(this.patientTicket)

      await Promise.all([
        new Promise((resolve, reject) => {
          this.doctorSubscription = doctorRef.onSnapshot(
            (doc) => (this.doctor = doc.data()) && resolve(),
            reject
          )
        }),
        new Promise((resolve, reject) => {
          this.patientSubscription = patientRef.onSnapshot((doc) => {
            const patient = doc.data()
            if (patient.canceledVideo && this.isDoctor) {
              this.$noty.info('O paciente cancelou a chamada de vídeo')
            }
            this.patient = patient
            resolve()
          }, reject)
        }),
      ])
    },
    setVideoReady(ready) {
      this.isVideoReady = ready
    },
    deleteVideoSession(inform = true) {
      return Promise.resolve().then(() => {
        if (this.isDoctor) {
          return this.$api.deleteConversationSession(this.patient.ticket, {
            video: true,
          })
        }
        return this.$api.deleteVideoSession(this.patient.ticket).then(() => {
          if (!inform) return
          return this.informPatientCanceledVideo({
            originCep: this.patient.originCep,
            doctorUsername: this.doctorUsername,
            patientTicket: this.patientTicket,
          })
        })
      })
    },
    yesOrNo(bool) {
      return bool ? 'Sim' : 'Não'
    },
    async confirmVideoChat() {
      this.isVideoAuthorized = await this.$dialog.confirm({
        text: 'O médico deseja iniciar uma chamada de vídeo. Você autoriza?',
      })
      if (!this.isVideoAuthorized) await this.deleteVideoSession()
    },
  },
}
</script>

<style scoped>
.conversation {
  --header-height: 120px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  max-height: calc(100vh - var(--header-height));
  align-items: center;
}

.conversation__video {
  width: 100%;
}

.conversation__video > div {
  position: relative;
  min-height: calc(50vh - var(--header-height));
  max-height: calc(50vh - var(--header-height));
  min-width: 50vh;
  max-width: 50vh;
  margin: 0 auto;
}

.conversation__chat {
  height: 100%;
  max-height: 100%;
}
</style>
