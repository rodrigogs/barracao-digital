<template>
  <div id="doctor-crud">
    <Create/>
    <List/>
  </div>
</template>

<script>
import Create from './Create.vue';
import List from './List.vue';

export default {
  name: 'DoctorCrud',

  components: {
    Create,
    List,
  },
};
</script>

<style scoped>
</style>
