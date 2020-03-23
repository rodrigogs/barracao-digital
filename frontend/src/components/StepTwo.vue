<template>
  <section class="section">
    <div class="container">
    </div>
  </section>
</template>

<script>
export default {
  name: 'StepTwo',
  components: {},
  mounted() {
    this.$emit('can-continue', { value: true });
  },
};
</script>
