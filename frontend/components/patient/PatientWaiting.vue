<template>
  <div>
    <v-card>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title> Você está na fila de atendimento </v-toolbar-title>

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
      type="info"
      elevation="1"
      class="mt-12 mb-0"
    >
      Não feche esta página, você irá receber instruções dos nossos médicos aqui
    </v-alert>
    <v-progress-linear
      color="blue lighten-2"
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

const ONE_SECOND = 1000

export default {
  name: 'PatientWaiting',
  components: {
    WhileWaitingInfo,
  },
  props: {
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
  },
  data: () => ({
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
  },
}
</script>
