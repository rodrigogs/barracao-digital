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
import { mapActions } from 'vuex';
import Stepper from 'vue-stepper';
import Loader from '@/components/Loader.vue';
import StepOne from '@/components/StepOne.vue';
import StepTwo from '@/components/StepTwo.vue';
import StepThree from '@/components/StepThree.vue';

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
    ...mapActions({
      signUpPatient: 'patients/signUpPatient',
    }),
    savePatientSignUp() {
      this.isLoading = true;

      this
        .signUpPatient()
        .then(
          ({ ticket }) => this.$router.push({ name: 'PatientEnqueued', params: { ticket }}),
          () => {
            // TODO: handle API rejected promise
          }
        )
        .finally(() => {
          this.isLoading = false;
        })
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
