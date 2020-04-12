<template>
  <v-card>

    <v-card-title>
      O atendimento foi finalizado pelo médico&nbsp;{{ patient.finishedDoctorDoctorName }}.
    </v-card-title>

    <v-card-subtitle v-if="patient.finishedDoctorFeedback">
      <h5>Confira o feedback abaixo:</h5>
    </v-card-subtitle>

    <v-card-text>
      <div v-html="patient.finishedDoctorFeedback" v-linkified />
    </v-card-text>

    <v-card-actions>
      <v-container>
        <v-row justify="center">
          <h6 v-if="!patient.patientFeedback">Avalie o seu atendimento:</h6>
          <h6 v-if="patient.patientFeedback">Você avaliou seu atendimento como</h6>
        </v-row>
        <v-row justify="center">
          <div class="stars-box" :class="{'stars-box--ltr' : patient.patientFeedback}">
            <button v-for="index in createArrayOfStars(patient.patientFeedback || 0)" :key="'s'+index" class="star" :disabled="!sendingFeedback && !!patient.patientFeedback"></button>
            <button v-for="index in createArrayOfStars(10-(patient.patientFeedback || 0))" :key="'se'+index" class="star star--empty" @click="sendPatientFeedback(index)" :disabled=" !sendingFeedback &&!!patient.patientFeedback"></button>
          </div>
        </v-row>
      </v-container>
    </v-card-actions>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { patients as patientsApi } from '@/api';
import Loader from '@/components/Loader.vue';
import linkify from 'vue-linkify';

export default {
  name: 'PatientStatusFinished',
  directives: {
    linkified: linkify,
  },
  computed: {
    ...mapGetters('patients', {
      patient: 'loggedInPatient',
    }),
  },
  data() {
    return {
      sendingFeedback: false,
    };
  },
  methods: {
    ...mapActions('patients', {
      upadteLoggedInPatient: 'loginPatient',
    }),
    async sendPatientFeedback(starQt) {
      this.sendingFeedback = true;
      try {
        const patient = await patientsApi.savePatientFeedback(this.patient.ticket, starQt);
        await this.upadteLoggedInPatient(patient);
        this.sendingFeedback = false;
      } catch (e) {
        this.$noty.error('Aconteceu algum erro, tente avaliar novamente mais tarde.');
        this.sendingFeedback = false;
      }
    },
    createArrayOfStars(quantity) {
      return Array(quantity).fill(0).map((v, i) => i + 1).reverse();
    },
  },
};
</script>
