<template>
  <v-dialog
    :value="true"
    :retain-focus="false"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Conversa com {{ talkingWith }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          :loading="isDeletingConversationSession"
          :disabled="isDeletingConversationSession"
          light
          @click="deleteConversationSession(true)"
        >
          Encerrar
        </v-btn>
      </v-toolbar>

      <div class="conversation">
        <div
          v-if="isFullyLoaded && isVideoAllowed && videoSession"
          v-show="isVideoReady"
          class="conversation__video secondary"
        >
          <ConversationVideo
            ref="video"
            :session-id="videoSession.sessionId"
            :token="videoSession.token"
            :is-publisher="isDoctor"
            @video-ready="setVideoReady"
            @disconnection="deleteConversationSession"
          />
        </div>

        <ConversationChat
          v-if="isFullyLoaded"
          class="conversation__chat"
          :doctor="doctor"
          :patient="patient"
          :is-doctor="isDoctor"
        />
      </div>
    </v-card>
  </v-dialog>
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
    isDeletingConversationSession: false,
    isVideoReady: false,
    patient: null,
    doctor: null,
    doctorSubscription: null,
    patientSubscription: null
  }),
  computed: {
    patientTextSession() {
      return this.patient && this.patient.textSession
    },
    videoSession() {
      return this.isDoctor
        ? this.doctor && this.doctor.videoSessions[this.patientTicket]
        : this.patient && this.patient.videoSession
    },
    isFullyLoaded() {
      return this.doctor && this.patient && this.validateSession()
    },
    talkingWith() {
      return this.isDoctor
        ? this.patient && this.patient.name
        : this.doctor && this.doctor.name
    }
  },
  watch: {
    patientTextSession(newSession, oldSession) {
      if (
        oldSession &&
        !newSession &&
        this.isFullyLoaded &&
        !this.patientTextSession
      )
        this.deleteConversationSession()
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
    validateSession() {
      const {
        patient: {
          textSession: patientTextSession,
          videoSession: patientVideoSession
        },
        doctor: {
          textSessions: { [this.patientTicket]: doctorTextSession },
          videoSessions: { [this.patientTicket]: doctorVideoSession }
        }
      } = this

      const validateTextSession = () => !patientTextSession || doctorTextSession

      const validateVideoSession = () =>
        !patientVideoSession || doctorVideoSession

      return validateTextSession() && validateVideoSession()
    },
    setVideoReady(ready) {
      this.isVideoReady = ready
    },
    async deleteConversationSession(shouldConfirm = false) {
      if (
        shouldConfirm &&
        !confirm('Esta ação deletará todos os dados desta conversa')
      )
        return
      try {
        if (this.isDoctor) {
          this.isDeletingConversationSession = true
          await this.$api.deleteConversationSession(this.patient.ticket)
        } else {
          this.$refs.video && (await this.$refs.video.disconnect())
          await this.$fireStore
            .collection('facilities')
            .doc(this.patient.originCep)
            .collection('patients')
            .doc(this.patient.ticket)
            .set({
              ...this.patient,
              textSession: null
            })
        }
      } catch (err) {
        this.$sentry.captureException(err)
      }
    }
  }
}
</script>

<style scoped>
.conversation {
  --header-height: 56px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  max-height: calc(100vh - var(--header-height));
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

@media screen and (min-width: 960px) {
  .conversation {
    --header-height: 64px;
  }
}
</style>
