<template>
  <pre>{{ list }}</pre>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorCrud',

  components: {
  },

  created() {
    this.refreshList();
  },

  data: () => ({
  }),

  computed: {
    ...mapActions('doctors', [
      'refreshList',
    ]),

    ...mapGetters('doctors', [
      'get',
      'list',
    ]),
  },
};
</script>

<style scoped>
</style>
