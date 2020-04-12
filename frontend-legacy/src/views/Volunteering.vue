<template>
  <div id="volunteering">
    <span>Em construção!<Loader/></span>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import { volunteers as volunteersApi } from '@/api';

export default {
  name: 'Volunteering',
  components: {
    Loader,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped>
#volunteering {
  height: 100%;
}

#volunteering > span, #volunteering > .loader {
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
