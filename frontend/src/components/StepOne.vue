<template>
  <section class="section">
    <div class="container">
      <div style="padding: 2rem 3rem; text-align: left;">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input type="text" placeholder="Text input" v-model="form.username">
          </div>
          <p v-if="false" class="help is-danger">This username is invalid</p>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input type="text" placeholder="Email input" v-model="form.demoEmail">
          </div>
          <p v-if="false" class="help is-danger">This email is invalid</p>
        </div>
        <div class="field">
          <label class="label">Message</label>
          <div class="control">
            <textarea placeholder="Textarea" v-model="form.message"></textarea>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StepOne',
  components: {},
  props: ['clickedNext', 'currentStep'],
  data() {
    return {
      form: {
        username: '',
        demoEmail: '',
        message: '',
      },
    };
  },
  mounted() {
    this.$emit('can-continue', { value: true });
  },
};
</script>
