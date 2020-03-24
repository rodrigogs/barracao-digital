<template>
  <div class="container">
    <stepper :steps="demoSteps"
             locale="pt"
             @stepper-finished="alert">
      <!--               @completed-step="completeStep"-->
      <!--               @active-step="isStepActive"-->
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
    // Executed when @completed-step event is triggered
    // completeStep(payload) {
    //   this.demoSteps.forEach((step) => {
    //     if (step.name === payload.name) {
    //       step.completed = true;
    //     }
    //   });
    // },
    // Executed when @active-step event is triggered
    // isStepActive(payload) {
    //   this.demoSteps.forEach((step) => {
    //     if (step.name === payload.name) {
    //       if (step.completed === true) {
    //         step.completed = false;
    //       }
    //     }
    //   });
    // },
    // Executed when @stepper-finished event is triggered
    alert() {
      // payload
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
    padding: .5rem 1rem;
  }
</style>
