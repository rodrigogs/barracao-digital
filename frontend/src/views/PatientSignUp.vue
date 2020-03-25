<template>
  <div class="container">
    <stepper :steps="steps"
             locale="pt"
             @stepper-finished="savePatientSignUp">
    </stepper>
  </div>
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
    };
  },
  methods: {
    savePatientSignUp() {
      const patientToSignUp = this.$store.patients.getters.getPatientToSignUp();
      const { data: registeredPatient } = patientsApi.signUpPatient(patientToSignUp);
      console.log(registeredPatient);
    },
  },
  beforeDestroy() {
    this.$store.commit('clearCampaign');
  },
};
</script>

<style>
  .stepper-box .content {
    margin-top: 0 !important;
  }

  .pacient-sign-up__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
