<template>
  <section class="section">
    <div class="container">
      <stepper :steps="demoSteps"
               @stepper-finished="alert">
        <!--               @completed-step="completeStep"-->
        <!--               @active-step="isStepActive"-->
      </stepper>
    </div>
  </section>
</template>

<script>
import Stepper from 'vue-stepper';
// This components will have the content for each stepper step.
import StepOne from '../components/StepOne.vue';
import StepTwo from '../components/StepTwo.vue';
import StepThree from '../components/StepThree.vue';

export default {
  name: 'PacientSignIn',
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
};
</script>

<style>
</style>
