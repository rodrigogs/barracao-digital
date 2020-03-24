<template>
    <div class="container">
    </div>
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
