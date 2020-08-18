<template>
  <v-container class="pa-0 ma-0">
    <video
      v-for="video in videos"
      :id="video.userId"
      :key="video.userId"
      ref="videos"
      :class="video.type"
      controls
      playsinline
    />
  </v-container>
</template>

<script>
import Vue from 'vue'
import RTCMultiConnection from 'rtcmulticonnection/dist/RTCMultiConnection'
import * as io from 'socket.io-client'
import delay from '@/utils/promiseDelay'
import 'webrtc-adapter'

window.enableAdapter = true
window.io = io // FIXME https://github.com/westonsoftware/vue-webrtc/issues/5

const SOCKET_URL = 'https://rtcmulticonnection.herokuapp.com:443/'
const ICE_SERVERS = [
  {
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun.l.google.com:19302?transport=udp',
    ],
  },
]

export default {
  name: 'NewWebRTCSession',
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    connection: null,
    videoInputDevices: [],
    audioInputDevices: [],
    videos: [],
  }),
  async mounted() {
    await this.initialize()
  },
  async beforeDestroy() {
    await this.destroy()
  },
  methods: {
    async initialize() {
      await delay(1000)
      this.connection = new RTCMultiConnection()
      await this.updateDevices()
      this.connection.socketURL = SOCKET_URL
      this.connection.autoCreateMediaElement = false
      this.connection.enableLogs = true
      this.connection.mediaConstraints = {
        audio: !!this.audioInputDevices.length,
        video: !!this.videoInputDevices.length,
      }
      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: !!this.audioInputDevices.length,
        OfferToReceiveVideo: !!this.videoInputDevices.length,
      }
      this.connection.iceServers = ICE_SERVERS
      this.connection.maxRelayLimitPerUser = 1
      this.connection.autoCloseEntireSession = true
      this.connection.bandwidth = {
        audio: 50, // 50 kbps
        video: 256, // 256 kbps
      }
      this.connection.mediaConstraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 800,
            maxWidth: 800,
            minHeight: 600,
            maxHeight: 600,
            minFrameRate: 15,
            maxFrameRate: 15,
          },
          optional: [{ facingMode: 'user' }],
        },
      }
      if (this.connection.DetectRTC.browser.name === 'Firefox') {
        this.connection.mediaConstraints = {
          audio: true,
          video: {
            width: 800,
            height: 600,
            frameRate: {
              min: 15,
              max: 15,
            },
            facingMode: 'user',
          },
        }
      }
      this.connection.onstream = this.onStreamHandler
      this.connection.onstreamended = this.onStreamEndedHandler
      await this.join()
    },
    destroy() {
      this.leave()
    },
    updateDevices() {
      return new Promise((resolve) => {
        this.connection.DetectRTC.load(() => {
          this.audioInputDevices = this.connection.DetectRTC.audioInputDevices
          this.videoInputDevices = this.connection.DetectRTC.videoInputDevices
          resolve()
        })
      })
    },
    join() {
      return new Promise((resolve, reject) => {
        this.connection.openOrJoin(this.roomId, (_, roomid, error) => {
          if (error) return reject(error)
          return resolve(roomid)
        })
      })
    },
    leave() {
      return new Promise((resolve) => {
        if (!this.connection) return
        this.connection.attachStreams.forEach((localStream) =>
          localStream.stop()
        )
        this.connection.closeSocket()
        this.connection.onclose = resolve
        this.videos = []
      })
    },
    onStreamHandler(event) {
      if (!this.connection.isInitiator && event.type === 'local') {
        this.connection.isUpperUserLeft = false
      }
      const video = {
        userId: event.userid,
        streamId: event.streamid,
        type: event.type,
        stream: event.stream,
      }
      this.videos.push(video)
      const looper = () => {
        Vue.nextTick(async () => {
          const videoElement = this.$refs.videos.find(
            (el) => el.id === video.userId
          )
          if (videoElement) {
            videoElement.srcObject = video.stream
            videoElement.play()
          } else {
            ;(await delay(1000)) && looper()
          }
        })
      }
      looper()
    },
    onStreamEndedHandler(event) {
      const videoIndex = this.videos.findIndex((v) => v.userid === event.userid)
      this.videos.splice(videoIndex, 1)
    },
  },
}
</script>

<style scoped>
.container {
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
}

video.remote {
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  position: absolute;
}

video.local {
  height: 5em !important;
  width: auto !important;
  z-index: 9052151380 !important;
  display: block;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}

video::-webkit-media-controls-fullscreen-button {
}
video::-webkit-media-controls-play-button {
  display: none;
}
video::-webkit-media-controls-play-button {
  display: none;
}
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-current-time-display {
}
video::-webkit-media-controls-time-remaining-display {
}
video::-webkit-media-controls-time-remaining-display {
}
video::-webkit-media-controls-mute-button {
}
video::-webkit-media-controls-toggle-closed-captions-button {
}
video::-webkit-media-controls-volume-slider {
}
</style>
