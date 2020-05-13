<template>
  <v-card tile flat width="100%">
    <div v-if="isFullyLoaded" class="conversation">
      <div
        v-if="patientVideoSession"
        class="conversation__video grey lighten-3"
      >
        <ConversationVideo
          v-if="isVideoAllowed && videoSession"
          ref="video"
          :session-id="videoSession.sessionId"
          :token="videoSession.token"
          :is-publisher="isDoctor"
          @video-ready="setVideoReady"
          @disconnection="deleteVideoSession"
        />
      </div>

      <ConversationChat
        class="conversation__chat"
        :doctor="doctor"
        :patient="patient"
        :is-doctor="isDoctor"
      />
    </div>
  </v-card>
</template>

<script>
import ConversationVideo from '~/components/conversation/ConversationVideo'
import ConversationChat from '~/components/conversation/ConversationChat'

export default {
  name: 'ConversationSession',
  components: {
    ConversationVideo,
    ConversationChat
  },
  props: {
    originCep: {
      type: String,
      required: true
    },
    doctorUsername: {
      type: String,
      required: true
    },
    patientTicket: {
      type: String,
      required: true
    },
    isDoctor: {
      type: Boolean,
      default: () => false
    },
    isVideoAllowed: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    isVideoReady: false,
    isPatientVideoAllowed: true,
    patient: null,
    doctor: null,
    doctorSubscription: null,
    patientSubscription: null
  }),
  computed: {
    videoSession() {
      return this.isDoctor
        ? this.doctor && this.doctor.videoSessions[this.patientTicket]
        : this.patient && this.patient.videoSession
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
    }
  },
  watch: {
    patientTextSession(hasSession, hadSession) {
      const wasSessionDeleted = hadSession && !hasSession
      if (wasSessionDeleted) {
        return this.$api.deleteConversationSession(this.patient.ticket, {
          video: true,
          text: true
        })
      }
    },
    isFullyLoaded() {
      if (this.isFullyLoaded && !this.isDoctor && !this.isVideoAllowed) {
        this.deletePatientFirestoreVideoSession()
      }
    }
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
  destroyed() {
    this.doctorSubscription && this.doctorSubscription()
    this.patientSubscription && this.patientSubscription()
  },
  methods: {
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
          this.patientSubscription = patientRef.onSnapshot(
            (doc) => (this.patient = doc.data()) && resolve(),
            reject
          )
        })
      ])
    },
    setVideoReady(ready) {
      this.isVideoReady = ready
    },
    deleteVideoSession() {
      return this.$api.deleteConversationSession(this.patient.ticket, {
        video: true
      })
    },
    deletePatientFirestoreTextSession() {
      return this.$fireStore
        .collection('facilities')
        .doc(this.patient.originCep)
        .collection('patients')
        .doc(this.patient.ticket)
        .set({
          ...this.patient,
          textSession: null
        })
    },
    deletePatientFirestoreVideoSession() {
      return this.$fireStore
        .collection('facilities')
        .doc(this.patient.originCep)
        .collection('patients')
        .doc(this.patient.ticket)
        .set({
          ...this.patient,
          videoSession: null
        })
    },
    yesOrNo(bool) {
      return bool ? 'Sim' : 'Não'
    }
  }
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
