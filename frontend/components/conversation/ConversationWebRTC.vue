<template>
  <vue-webrtc
    ref="webrtc"
    camera-height="364"
    :room-id="ticket"
    enable-audio
    enable-video
    @joined-room="logEvent"
    @left-room="logEvent"
    @opened-room="logEvent"
    @share-started="logEvent"
    @share-stopped="logEvent"
    @error="errorHandler"
  />
</template>

<script>
import Vue from 'vue'
import { WebRTC } from 'vue-webrtc'

Vue.component(WebRTC.name, WebRTC)

export default {
  name: 'ConversationWebRTC',
  props: {
    ticket: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    img: null,
  }),
  async mounted() {
    await this.joinRoom()
  },
  async beforeDestroy() {
    await this.leaveRoom()
  },
  methods: {
    startCapture() {
      this.img = this.$refs.webrtc.capture()
    },
    joinRoom() {
      this.$refs.webrtc.join()
    },
    leaveRoom() {
      this.$refs.webrtc.leave()
    },
    shareScreen() {
      this.img = this.$refs.webrtc.shareScreen()
    },
    errorHandler(error, stream) {
      console.log('On Error Event', error, stream)
    },
    logEvent(event) {
      console.log('Event : ', event)
    },
  },
}
</script>
