<template>
  <div id="patient-signup">
    <Consent v-if="!isConsentAccepted" />
    <Stepper
      v-else-if="!isLoading"
      class="patient-signup"
      :steps="steps"
      locale="pt"
      @stepper-finished="savePatientSignUp"
    />
    <Loader v-else />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Stepper from 'vue-stepper';
import Loader from '@/components/Loader.vue';
import StepOne from '@/components/StepOne.vue';
import StepTwo from '@/components/StepTwo.vue';
import StepThree from '@/components/StepThree.vue';
import Consent from '@/components/Consent.vue';

export default {
  name: 'PatientSignUp',
  components: {
    Stepper,
    Loader,
    Consent,
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
    ...mapActions('patients', [
      'signUpPatient',
    ]),
    ...mapActions('consent', [
      'acceptConsent',
    ]),
    async savePatientSignUp() {
      try {
        this.isLoading = true;
        const { ticket } = await this.signUpPatient();
        this.$router.push({ name: 'PatientEnqueued', params: { ticket } });
      } catch (err) {
        this.$noty.error('Houve uma falha ao criar o seu cadástro.');
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    ...mapGetters('consent', [
      'isConsentAccepted',
    ]),
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
