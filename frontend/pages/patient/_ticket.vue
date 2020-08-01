<template>
  <v-container fluid>
    <div v-if="showStatus">
      <component
        :is="patientStatusComponent.component"
        v-bind="patientStatusComponent.props"
      />
    </div>
    <div v-else>
      <v-dialog :value="patient" fullscreen>
        <v-card elevation="0" append flat tile>
          <v-app-bar
            v-if="patient.textSession"
            color="primary"
            dense
            extended
            dark
          >
            <v-toolbar-title v-if="currentStatus">
              {{ currentStatus.doctorName }} está atendendo você
            </v-toolbar-title>
            <template v-slot:extension>
              <v-spacer></v-spacer>

              <v-toolbar-items>
                <v-tooltip v-if="isWaitingKit" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      dark
                      :loading="isLoading"
                      @click="receiveKit"
                      v-on="on"
                    >
                      Recebi o kit <v-icon right>mdi-medical-bag</v-icon>
                    </v-btn>
                  </template>
                  <span>Informar recebimento do kit médico</span>
                </v-tooltip>

                <v-tooltip v-if="isSendingKitBack" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      dark
                      :loading="isLoading"
                      @click="sendKit"
                      v-on="on"
                    >
                      Devolvi o kit <v-icon right>mdi-medical-bag</v-icon>
                    </v-btn>
                  </template>
                  <span>Informar que você já devolveu o kit médico</span>
                </v-tooltip>

                <v-tooltip v-if="patient.videoSession" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      dark
                      :loading="isVideoLoading"
                      @click="finishVideoSession"
                      v-on="on"
                    >
                      Encerrar vídeo <v-icon right>mdi-video-off</v-icon>
                    </v-btn>
                  </template>
                  <span>Encerrar a sessão de vídeo</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon dark @click="fileDialog = true" v-on="on">
                      <v-icon>mdi-clippy</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar arquivo</span>
                </v-tooltip>
              </v-toolbar-items>

              <v-spacer></v-spacer>
            </template>
          </v-app-bar>
          <v-container fluid>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-card flat tile>
                  <ConversationSession
                    v-if="patient.textSession"
                    ref="conversationSession"
                    :origin-cep="patient.originCep"
                    :doctor-username="currentStatus.doctorUsername"
                    :patient-ticket="patient.ticket"
                    :is-doctor="false"
                  />
                  <v-overlay v-else opacity="0.8" class="text-center">
                    <p>Aguarde</p>
                    <p>Seu atendimento iniciará em um instante</p>
                    <v-icon>mdi-loading mdi-spin</v-icon>
                  </v-overlay>
                  <ConversationFileUpload
                    v-model="fileDialog"
                    :patient-ticket="patient.ticket"
                    :origin-cep="patient.originCep"
                    :doctor-username="
                      currentStatus ? currentStatus.doctorUsername : ''
                    "
                    :is-doctor="false"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import ConversationFileUpload from '../../components/conversation/ConversationFileUpload'
import { PATIENT_STATUS } from '@/constants'
import PatientWaiting from '@/components/patient/PatientWaiting.vue'
import PatientOngoing from '@/components/patient/PatientOngoing.vue'
import PatientWaitingKit from '@/components/patient/PatientWaitingKit.vue'
import PatientFinished from '@/components/patient/PatientFinished.vue'
import PatientCantBeAssisted from '@/components/patient/PatientCantBeAssisted.vue'
import PatientFacilityNotAvailable from '@/components/patient/PatientFacilityNotAvailable.vue'
import PatientGaveUp from '@/components/patient/PatientGaveUp.vue'
import ConversationSession from '@/components/conversation/ConversationSession'

const searchPatientByTicket = async (api, ticket) => {
  const {
    originCep,
    name,
    createdAt,
    status,
    ongoingStatus,
    // eslint-disable-next-line camelcase
    waiting_kitStatus,
    finishedStatus,
    textSession,
    videoSession,
  } = await api.searchPatientByTicket(ticket)
  return {
    ticket,
    originCep,
    name,
    createdAt,
    status,
    ongoingStatus,
    waiting_kitStatus,
    finishedStatus,
    textSession,
    videoSession,
  }
}

const searchFacilityByOrigin = async (api, origin) => {
  try {
    const { cantBeAssistedMessage } = await api.getFacilityByOrigin(origin)
    return {
      cantBeAssistedMessage,
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return {}
  }
}

export default {
  layout: 'patients',
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    ConversationFileUpload,
    ConversationSession,
  },
  async asyncData({ app, params, error }) {
    try {
      const patient = await searchPatientByTicket(app.$api, params.ticket)
      const facility = await searchFacilityByOrigin(app.$api, patient.originCep)
      return { patient, facility }
    } catch (e) {
      error({ message: 'Usuário Inexistente', statusCode: 404 })
    }
  },
  data: () => ({
    fileDialog: false,
    isLoading: false,
    isVideoLoading: false,
    tab: null,
    isVideoChatOpen: false,
    patientSubscription: null,
    patient: {
      name: null,
      createdAt: null,
      status: null,
      [`${PATIENT_STATUS.ONGOING}Status`]: {
        originCep: null,
        patientTicket: null,
        doctorUsername: null,
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        timestamp: null,
      },
      [`${PATIENT_STATUS.WAITING_KIT}Status`]: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        receivedAt: null,
        receivedMessage: null,
        sentAt: null,
        sentMessage: null,
        timestamp: null,
      },
      [`${PATIENT_STATUS.FINISHED}Status`]: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        patientOutcome: null,
        patientFeedback: null,
        timestamp: null,
      },
    },
  }),
  computed: {
    currentStatus() {
      return this.patient && this.patient[`${this.patient.status}Status`]
    },
    showStatus() {
      return [
        PATIENT_STATUS.WAITING,
        PATIENT_STATUS.GAVE_UP,
        PATIENT_STATUS.FINISHED,
        PATIENT_STATUS.CANT_BE_ASSISTED,
        PATIENT_STATUS.FACILITY_NOT_AVAILABLE,
      ].includes(this.patient.status)
    },
    isWaitingKit() {
      return (
        this.patient.status === PATIENT_STATUS.WAITING_KIT &&
        !this.patient[`${this.patient.status}Status`].receivedAt
      )
    },
    isSendingKitBack() {
      return (
        !this.isWaitingKit &&
        this.patient.status === PATIENT_STATUS.WAITING_KIT &&
        !this.patient[`${this.patient.status}Status`].sentAt
      )
    },
    patientStatusComponent() {
      return {
        [PATIENT_STATUS.WAITING]: () => ({
          component: PatientWaiting,
          props: {
            createdAt: this.patient.createdAt,
            ticket: this.$route.params.ticket,
            originCep: this.patient.originCep,
          },
        }),
        [PATIENT_STATUS.ONGOING]: () => ({
          component: PatientOngoing,
          props: {
            ...this.patient[`${PATIENT_STATUS.ONGOING}Status`],
            patient: this.patient,
          },
        }),
        [PATIENT_STATUS.WAITING_KIT]: () => ({
          component: PatientWaitingKit,
          props: {
            patient: this.patient,
          },
        }),
        [PATIENT_STATUS.FINISHED]: () => ({
          component: PatientFinished,
          props: {
            ...this.patient[`${PATIENT_STATUS.FINISHED}Status`],
            clicked: this.ratingClicked,
          },
        }),
        [PATIENT_STATUS.CANT_BE_ASSISTED]: () => ({
          component: PatientCantBeAssisted,
          props: {
            name: this.patient.name,
            createdAt: this.patient.createdAt,
            originCep: this.patient.originCep,
            ticket: this.patient.ticket,
            message: this.facility.cantBeAssistedMessage,
          },
        }),
        [PATIENT_STATUS.FACILITY_NOT_AVAILABLE]: () => ({
          component: PatientFacilityNotAvailable,
        }),
        [PATIENT_STATUS.GAVE_UP]: () => ({
          component: PatientGaveUp,
        }),
      }[this.patient.status]()
    },
  },
  mounted() {
    this.handleMessaging()
    this.handleUpdates()
  },
  beforeDestroy() {
    if (this.patientSubscription) this.patientSubscription() // Unsubscribes
  },
  methods: {
    ...mapActions('chat', {
      informPatientReceivedKit: 'informPatientReceivedKit',
      informPatientSentKitBack: 'informPatientSentKitBack',
    }),
    handleUpdates() {
      if (!this.patient.originCep) return
      if (this.patientSubscription) this.patientSubscription()
      this.patientSubscription = this.$fireStore
        .collection('facilities')
        .doc(this.patient.originCep)
        .collection('patients')
        .doc(this.patient.ticket)
        .onSnapshot((doc) => {
          this.$set(this, 'patient', doc.data())
        })
    },
    async handleMessaging() {
      try {
        const currentToken = await this.$fireMess.getToken()
        await this._updatePatientMessagingToken(currentToken)
        this.$fireMess.onTokenRefresh(async () => {
          const updatedToken = await this.$fireMess.getToken()
          await this._updatePatientMessagingToken(updatedToken)
        })
      } catch (_error) {}
    },
    finishVideoSession() {
      this.isVideoLoading = true
      this.$refs.conversationSession
        .deleteVideoSession()
        .finally(() => (this.isVideoLoading = false))
    },
    ratingClicked(rating) {
      return this.$api
        .savePatientFeedback(this.$route.params.ticket, rating)
        .then(
          (patient) => {
            this.$noty.success('Sua avaliação foi enviada com sucesso.')
            this.patient = patient
          },
          (error) => {
            this.$noty.error(
              'Desculpe, ocorreu um erro, tente avaliar novamente mais tarde.'
            )
            return Promise.reject(error)
          }
        )
    },
    _updatePatientMessagingToken(token) {
      if (!token) return Promise.reject(new Error('Invalid token!'))
      return this.$api.setPatientMessagingToken(this.$route.params.ticket, {
        token,
      })
    },
    async receiveKit() {
      if (
        !(await this.$dialog.confirm({
          text: 'Você confirma que já recebeu o kit médico?',
        }))
      )
        return
      this.isLoading = true
      return this.$api
        .setWaitingKitReceived(this.patient.ticket)
        .then(() =>
          this.informPatientReceivedKit({
            originCep: this.patient.originCep,
            doctorUsername: this.currentStatus.doctorUsername,
            patientTicket: this.patient.ticket,
          })
        )
        .finally(() => (this.isLoading = false))
    },
    async sendKit() {
      if (
        !(await this.$dialog.confirm({
          text: 'Você confirma que já devolveu o kit médico?',
        }))
      )
        return
      this.isLoading = true
      return this.$api
        .setWaitingKitSent(this.patient.ticket)
        .then(() =>
          this.informPatientSentKitBack({
            originCep: this.patient.originCep,
            doctorUsername: this.currentStatus.doctorUsername,
            patientTicket: this.patient.ticket,
          })
        )
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>
