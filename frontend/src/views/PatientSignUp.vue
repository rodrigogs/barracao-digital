<template>
  <span>
    <div v-if="!isLoading" class="container" style="margin-top: 1rem;">
      <stepper :steps="steps"
               locale="pt"
               @stepper-finished="savePatientSignUp">
      </stepper>
    </div>
    <div v-if="isLoading" class="container">
      <div class="patient-enqueued__loader">
        <div class="loader"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  </span>
</template>

<script>

import { patients as patientsApi } from '@/api';
import Stepper from 'vue-stepper';
import StepOne from '../components/StepOne.vue';
import StepTwo from '../components/StepTwo.vue';
import StepThree from '../components/StepThree.vue';

export default {
  name: 'PatientSignUp',
  components: {
    Stepper,
  },
  data() {
    return {
      steps: [
        {
          icon: 'looks_one',
          name: 'first',
          component: StepOne,
          completed: false,
        },
        {
          icon: 'looks_two',
          name: 'second',
          component: StepTwo,
          completed: false,
        },
        {
          icon: 'looks_3',
          name: 'third',
          component: StepThree,
          completed: false,
        },
      ],
      isLoading: false,
    };
  },
  methods: {
    async savePatientSignUp() {
      this.isLoading = true;
      const patientToSignUp = this.$store.getters['patients/getPatientToSignUp'];
      const { data: registeredPatient } = await patientsApi.signUpPatient(patientToSignUp);
      this.$store.commit('patients/clearForm');
      this.$router.push(`/pacientes/senha/${registeredPatient.ticket}`);
    },
  },
  beforeDestroy() {
    this.$store.commit('patients/clearForm');
  },
};
</script>

<style>
  .stepper-box .content {
    margin-top: 0 !important;
  }

  .pacient-sign-up__form {
    max-width: 400px;
    margin: auto;
  }
</style>
