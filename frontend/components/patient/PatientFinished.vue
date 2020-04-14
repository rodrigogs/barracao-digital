<template>
  <v-card>
    <v-card-title>O atendimento foi finalizado.</v-card-title>
    <v-card-text class="text-center">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Médico:</v-card-title>
              <v-card-text>
                {{ doctorName }}
                <p><strong>CRM:</strong> {{ doctorCrm }}</p>
                <p><strong>Estado:</strong> {{ doctorState }}</p>
                <p><strong>Instalação:</strong> {{ facilityName }}</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                Confira o feedback do seu atendimento:
              </v-card-title>
              <v-card-text class="text-left subtitle-1">
                <div v-linkified v-html="doctorMessage" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <span class="subtitle-1" v-text="ratingTitle">
        Avalie o seu atendimento:
      </span>
      <v-rating
        v-model="rating"
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
        length="5"
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
  </v-card>
</template>

<script>
import linkify from 'vue-linkify'

export default {
  name: 'PatientFinished',
  directives: {
    linkified: linkify
  },
  props: {
    doctorName: {
      type: String,
      required: true
    },
    doctorCrm: {
      type: Number,
      required: true
    },
    doctorState: {
      type: String,
      required: true
    },
    doctorMessage: {
      type: String,
      required: true
    },
    facilityName: {
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
    ratingSubmitted() {
      this.isLoading = true
      this.clicked(this.rating).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
