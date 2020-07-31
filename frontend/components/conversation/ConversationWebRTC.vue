<template>
  <WebRTCSession
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
import WebRTCSession from './WebRTCSession'

export default {
  name: 'ConversationWebRTC',
  components: {
    WebRTCSession,
  },
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
      // eslint-disable-next-line no-console
      console.log('On Error Event', error, stream)
    },
    logEvent(event) {
      // eslint-disable-next-line no-console
      console.log('Event : ', event)
    },
  },
}
</script>
