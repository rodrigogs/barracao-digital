<template>
  <div class="container">
    <stepper :steps="demoSteps"
             locale="pt"
             @stepper-finished="savePacientSignUp">
    </stepper>
  </div>
</template>

<script>
import Stepper from 'vue-stepper';
import StepOne from '../components/StepOne.vue';
import StepTwo from '../components/StepTwo.vue';
import StepThree from '../components/StepThree.vue';

export default {
  name: 'PacientSignUp',
  components: {
    Stepper,
  },
  data() {
    return {
      demoSteps: [
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
    savePacientSignUp() {
      alert('end');
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
