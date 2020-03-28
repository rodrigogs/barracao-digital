<template>
  <Stepper
    class="patient-signup"
    v-if="!isLoading"
    :steps="steps"
               locale="pt"
    @stepper-finished="savePatientSignUp"
  />
  <Loader v-else />
</template>

<script>

import { patients as patientsApi } from '@/api';
import Stepper from 'vue-stepper';
import Loader from '@/components/Loader.vue';

export default {
  name: 'PatientSignUp',
  components: {
    Stepper,
    Loader
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

<style scoped>
.patient-signup {
  margin-top: 1rem;
  }

.patient-signup > /deep/ .content {
  margin-top: 0;
  }
</style>
