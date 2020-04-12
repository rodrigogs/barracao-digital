<template>
  <v-card-text class="text-center">
    <p class="blue--text title">
      <span>O atendimento foi finalizado pelo médico</span>
      <b>{{ doctorName }}</b>
    </p>

    <div v-if="doctorFeedback" class="mb-8">
      <p class="blue--text title">
        Confira o feedback abaixo:
      </p>
      <v-card>
        <v-card-text class="subtitle-1 text-left">
          {{ doctorFeedback }}
        </v-card-text>
      </v-card>
    </div>

    <span class="subtitle-1" v-text="ratingTitle">
      Avalie o seu atendimento:
    </span>
    <v-rating
      v-model="rating"
      color="yellow darken-3"
      background-color="grey darken-1"
      empty-icon="$ratingFull"
      length="10"
      :readonly="!!patientFeedback || isLoading"
      hover
    ></v-rating>
    <v-btn
      class="mt-4"
      color="primary"
      :loading="isLoading"
      :disabled="!!patientFeedback || isLoading"
      @click="ratingSubmitted"
    >
      Enviar
    </v-btn>
  </v-card-text>
</template>

<script>
export default {
  name: 'PatientFinished',
  props: {
    doctorName: {
      type: String,
      required: true
    },
    doctorFeedback: {
      type: String,
      required: true
    },
    patientFeedback: {
      type: Number,
      required: false,
      default: 0
    },
    clicked: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    rating: 0
  }),
  computed: {
    ratingTitle() {
      return this.patientFeedback
        ? 'Você avaliou seu atendimento como:'
        : 'Avalie o seu atendimento:'
    }
  },
  mounted() {
    this.rating = this.patientFeedback
  },
  methods: {
    ratingSubmitted(rating) {
      this.isLoading = true
      this.clicked(rating).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
