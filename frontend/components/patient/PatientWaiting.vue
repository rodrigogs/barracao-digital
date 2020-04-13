<template>
  <v-card-text class="text-center">
    <p class="title font-weight-medium blue--text">
      Você está na fila de atendimento
    </p>

    <p class="subtitle-1">
      Fique com o telefone e suas formas de comunicação disponiveis e online.
    </p>

    <p>
      <b>Assim que possível um médico entrará em contato com você.</b>
    </p>

    <p>
      <b>Tempo na fila: {{ timeInQueue }}</b>
    </p>

    <p class="title font-weight-medium red--text">
      <span>Sua senha de retorno é</span>
      <br />
      <b class="">{{ ticket }}</b>
    </p>

    <p>
      Caso você perca a conexão, retorne à fila de atendimento usando a senha
      acima.
    </p>
  </v-card-text>
</template>

<script>
import Kairos from 'kairos'

const ONE_SECOND = 1000

export default {
  name: 'PatientWaiting',
  props: {
    createdAt: {
      type: Number,
      required: true
    },
    ticket: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    timeInQueue: null,
    timeInterval: null
  }),
  mounted() {
    this.timeInterval = setInterval(this.setUpTimer.bind(this), ONE_SECOND)
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    this.timeInterval = null
  },
  methods: {
    setUpTimer() {
      const timeWaiting = Date.now() - this.createdAt
      this.timeInQueue = Kairos.new(timeWaiting).toString('hh:mm:ss')
    }
  }
}
</script>
