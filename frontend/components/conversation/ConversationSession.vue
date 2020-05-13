<template>
  <v-dialog
    :value="true"
    :retain-focus="false"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar flat dark extended color="primary">
        <template v-slot:extension>
          <v-toolbar-title>
            {{ talkingWith }}, {{ patient && patient.age }} anos
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-tooltip v-if="isDoctor" bottom open-on-click>
            <template v-slot:activator="{ on }">
              <v-btn
                :loading="isDeletingConversationSession"
                :disabled="isDeletingConversationSession"
                icon
                dark
                v-on="on"
              >
                <v-icon>mdi-account-details</v-icon>
              </v-btn>
            </template>
            <span>
              <p>
                <strong>Alergias:</strong> {{ patient && patient.allergies }}
              </p>
              <p><strong>Medicações:</strong> {{ patient && patient.meds }}</p>
              <p>
                <strong>Convênio:</strong> {{ patient && patient.covenant }}
              </p>
              <p>
                <strong>Já foi atendido?</strong>
                {{ yesOrNo(patient && patient.hasBeenAssisted) }}
              </p>
            </span>
          </v-tooltip>
        </template>

        Senha {{ patient && patient.ticket }}

        <v-spacer />

        <v-tooltip v-if="isDoctor" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :loading="isDeletingConversationSession"
              :disabled="isDeletingConversationSession"
              icon
              dark
              v-on="on"
              @click="deleteConversationSession(true)"
            >
              <v-icon>mdi-medical-bag</v-icon>
            </v-btn>
          </template>
          <span>Enviar kit médico</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              dark
              :loading="isDeletingConversationSession"
              :disabled="isDeletingConversationSession"
              v-on="on"
              @click="deleteConversationSession(true)"
            >
              <v-icon>mdi-power</v-icon>
            </v-btn>
          </template>
          <span>Encerrar sessão</span>
        </v-tooltip>
      </v-toolbar>

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
            @disconnection="deleteConversationSession"
          />
        </div>

        <ConversationChat
          v-if="patientTextSession"
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
      return this.doctor && this.patient && this.validateSession()
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
        return this.deleteConversationSession()
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
          await this.deletePatientFirestoreTextSession()
          await this.deletePatientFirestoreVideoSession()
        }
      } catch (err) {
        this.$sentry.captureException(err)
      }
    },
    yesOrNo(bool) {
      return bool ? 'Sim' : 'Não'
    }
  }
}
</script>

<style scoped>
.conversation {
  --header-height: 56px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  max-height: calc(100vh - var(--header-height));
  align-items: center;
}

.conversation__video {
  width: 100%;
  max-width: 800px;
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
