<template>
  <v-dialog :value="patient" fullscreen>
    <v-card flat tile>
      <v-app-bar color="primary" dense extended dark>
        <v-toolbar-title>
          {{ patient.name }}, {{ patient.age }} anos
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-tooltip
            v-if="tab === 'conversation' && !patient.videoSession"
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                dark
                :loading="videoLoading"
                @click="startVideoSession"
                v-on="on"
              >
                <v-icon>mdi-video</v-icon>
              </v-btn>
            </template>
            <span>Iniciar vídeo</span>
          </v-tooltip>
          <v-tooltip
            v-else-if="tab === 'conversation' && patient.videoSession"
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                dark
                :loading="videoLoading"
                @click="finishVideoSession"
                v-on="on"
              >
                <v-icon>mdi-video-off</v-icon>
              </v-btn>
            </template>
            <span>Encerrar vídeo</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon dark @click="$emit('close')" v-on="on">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Sair</span>
          </v-tooltip>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tab" centered fixed-tabs dark>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#info">
              Informações
              <v-icon right>mdi-file-document-edit</v-icon>
            </v-tab>

            <v-tab v-if="patient.textSession" href="#conversation">
              Conversa
              <v-badge
                v-if="getReceivedMessages > 0 && tab !== 'conversation'"
                color="red"
                dot
              >
                <v-icon right>mdi-chat</v-icon>
              </v-badge>
              <v-icon v-else right>mdi-chat</v-icon>
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>

      <v-container fluid>
        <v-row justify="center" no-gutters>
          <v-col cols="12" md="10">
            <v-card flat tile>
              <v-tabs-items v-model="tab">
                <v-tab-item value="info">
                  <DoctorPatientStatusModalInfo
                    :patient="patient"
                    :save="save"
                    :open-conversation="openConversationTab"
                  ></DoctorPatientStatusModalInfo>
                </v-tab-item>

                <v-tab-item
                  v-if="patient && patient.textSession"
                  value="conversation"
                >
                  <ConversationSession
                    :origin-cep="patient.originCep"
                    :doctor-username="$auth.user.username"
                    :patient-ticket="patient.ticket"
                    :is-doctor="true"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DoctorPatientStatusModalInfo from './DoctorPatientStatusModalInfo'
import ConversationSession from '~/components/conversation/ConversationSession'

export default {
  name: 'DoctorPatientStatusModal',
  components: {
    DoctorPatientStatusModalInfo,
    ConversationSession,
  },
  props: {
    patient: {
      type: Object,
      required: true,
    },
    save: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    tab: null,
    videoLoading: false,
  }),
  computed: {
    ...mapGetters('chat', {
      getReceivedMessages: 'getReceivedMessages',
    }),
    hasActiveConversation() {
      return !!this.videoSession || !!this.textSession
    },
    textSession() {
      return this.patient && this.patient.textSession
    },
    videoSession() {
      return (
        this.$auth.user &&
        this.$auth.user.videoSessions &&
        this.$auth.user.videoSessions[this.patient.ticket]
      )
    },
  },
  watch: {
    tab(newTab, oldTab) {
      if (newTab === 'conversation' || oldTab === 'conversation')
        this.readMessages()
    },
  },
  methods: {
    ...mapActions('chat', [
      'readMessages',
      'startConversation',
      'deleteConversation',
      'informDoctorCanceledVideo',
    ]),
    openConversationTab() {
      return Promise.resolve()
        .then(() => {
          if (!this.patient.textSession) return this.startTextSession()
        })
        .finally(() => (this.tab = 'conversation'))
    },
    startTextSession() {
      return this.startConversation({
        originCep: this.patient.originCep,
        doctorUsername: this.$auth.user.username,
        patientTicket: this.patient.ticket,
        text: true,
      })
    },
    finishTextSession() {
      this.videoLoading = true
      return this.deleteConversation({
        originCep: this.patient.originCep,
        doctorUsername: this.$auth.user.username,
        patientTicket: this.patient.ticket,
        text: true,
      }).finally(() => (this.videoLoading = false))
    },
    startVideoSession() {
      this.videoLoading = true
      return this.startConversation({
        originCep: this.patient.originCep,
        doctorUsername: this.$auth.user.username,
        patientTicket: this.patient.ticket,
        video: true,
      }).finally(() => (this.videoLoading = false))
    },
    finishVideoSession() {
      this.videoLoading = true
      return this.deleteConversation({
        originCep: this.patient.originCep,
        doctorUsername: this.$auth.user.username,
        patientTicket: this.patient.ticket,
        video: true,
      })
        .then(() =>
          this.informDoctorCanceledVideo({
            originCep: this.patient.originCep,
            doctorUsername: this.$auth.user.username,
            patientTicket: this.patient.ticket,
          })
        )
        .finally(() => (this.videoLoading = false))
    },
  },
}
</script>
