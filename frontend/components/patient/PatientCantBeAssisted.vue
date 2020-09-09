<template>
  <div>
    <v-card>
      <v-toolbar dense dark color="error">
        <v-toolbar-title>
          {{ name }}, nossa equipe está sobrecarregada no momento.
        </v-toolbar-title>

        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="flex align-center text-right" v-on="on">
              <v-icon class="mr-1"> mdi-clock-outline </v-icon>
              <span class="body-2">{{ timeInQueue || '-' }}</span>
            </div>
          </template>
          <span>Tempo na fila</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="text-center">
        <p class="subtitle-1 mb-1">Guarde a sua senha de retorno</p>
        <v-chip large>
          <v-icon class="mr-2"> mdi-key </v-icon>
          <span class="title">{{ ticket }}</span>
        </v-chip>
      </v-card-text>
    </v-card>

    <v-alert
      icon="mdi-information-outline"
      prominent
      text
      type="error"
      elevation="1"
      class="mt-12 mb-0"
    >
      {{ message }}
    </v-alert>
    <v-progress-linear
      color="red lighten-2"
      buffer-value="0"
      height="6"
      stream
      class="mt-1 mb-12"
    ></v-progress-linear>

    <WhileWaitingInfo />
  </div>
</template>

<script>
import Kairos from 'kairos'
import WhileWaitingInfo from './WhileWaitingInfo'
import { PATIENT_STATUS } from '~/constants'

const ONE_SECOND = 1000

export default {
  name: 'PatientCantBeAssisted',
  components: {
    WhileWaitingInfo,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
    originCep: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
      default: () =>
        'Por favor, anote sua senha de retorno e retorne aqui no site ou aplicativo entre 18 e 21h, que é quando temos um maior número de médicos voluntários on-line. Obrigado pela paciência!',
    },
  },
  data: () => ({
    dialog: false,
    isLoading: false,
    timeInQueue: null,
    timeInterval: null,
  }),
  mounted() {
    this.timeInterval = setInterval(this.setUpTimer.bind(this), ONE_SECOND)
    this.keepAlive()
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    this.timeInterval = null
  },
  methods: {
    setUpTimer() {
      const timeWaiting = Date.now() - this.createdAt
      this.timeInQueue = Kairos.new(timeWaiting).toString('hh:mm:ss', true)
    },
    async keepAlive() {
      try {
        await this.$fireStore
          .collection('facilities')
          .doc(this.originCep)
          .collection('patients')
          .doc(this.ticket)
          .set({ keepAlive: Date.now() }, { merge: true })
      } finally {
        setTimeout(() => this.keepAlive(), 20000)
      }
    },
    giveUp() {
      this.isLoading = true
      this.$api
        .setPatientStatus(this.ticket, {
          status: PATIENT_STATUS.GAVE_UP,
        })
        .finally(() => {
          this.isLoading = false
          this.dialog = false
        })
    },
  },
}
</script>
