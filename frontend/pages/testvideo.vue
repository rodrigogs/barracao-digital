<template>
  <div class="container">
    <NewWebRTCSession room-id="foobar" />
  </div>
</template>

<script>
import NewWebRTCSession from '../components/conversation/NewWebRTCSession'

export default {
  components: {
    NewWebRTCSession,
  },
}
</script>

<style scoped>
.container {
  background: fuchsia;
}
</style>
