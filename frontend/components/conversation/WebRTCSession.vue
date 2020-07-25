<template>
  <v-container class="pa-0" width="100%">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <video
          v-if="localVideo"
          :id="localVideo.id"
          ref="localVideo"
          controls
          autoplay
          playsinline
          :height="cameraHeight"
          :muted="localVideo.muted"
        />
      </v-col>
      <v-col cols="12" md="6">
        <video
          v-for="item in remoteVideos"
          :id="item.id"
          :key="item.id"
          ref="remoteVideos"
          controls
          autoplay
          playsinline
          :height="cameraHeight"
          :muted="item.muted"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'adapterjs'
import Vue from 'vue'
import RTCMultiConnection from 'rtcmulticonnection'

const addStreamStopListener = (stream, callback) => {
  let streamEndedEvent = 'ended'
  if ('oninactive' in stream) {
    streamEndedEvent = 'inactive'
  }
  stream.addEventListener(streamEndedEvent, callback, false)
}

const onGettingSteam = (that) => (stream) => {
  that.rtcmConnection.addStream(stream)
  that.$emit('share-started', stream.streamid)

  addStreamStopListener(stream, () => {
    that.rtcmConnection.removeStream(stream.streamid)
    that.$emit('share-stopped', stream.streamid)
  })
}

const getDisplayMediaError = (error) => {
  // eslint-disable-next-line no-console
  console.log('Media error: ' + JSON.stringify(error))
}

export default {
  name: 'WebRTCSession',
  props: {
    roomId: {
      type: String,
      required: true,
    },
    socketURL: {
      type: String,
      default: 'https://rtcmulticonnection.herokuapp.com:443/',
    },
    cameraHeight: {
      type: [Number, String],
      default: 160,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    screenshotFormat: {
      type: String,
      default: 'image/jpeg',
    },
    enableAudio: {
      type: Boolean,
      default: true,
    },
    enableVideo: {
      type: Boolean,
      default: true,
    },
    enableLogs: {
      type: Boolean,
      default: false,
    },
    stunServer: {
      type: String,
      default: null,
    },
    turnServer: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rtcmConnection: null,
      audioInputDevices: [],
      videoInputDevices: [],
      videoList: [],
      canvas: null,
      ctx: null,
    }
  },
  computed: {
    localVideo() {
      return this.videoList.find((video) => video.type === 'local')
    },
    remoteVideos() {
      return this.videoList.filter((video) => video.type === 'remote')
    },
  },
  mounted() {
    this.configure()
    this.scanDevices()
  },
  methods: {
    configure() {
      this.rtcmConnection = new RTCMultiConnection()
      this.rtcmConnection.socketURL = this.socketURL
      this.rtcmConnection.autoCreateMediaElement = false
      this.rtcmConnection.enableLogs = this.enableLogs
      this.rtcmConnection.session = {
        audio: this.enableAudio,
        video: this.enableVideo,
      }
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.enableAudio,
        OfferToReceiveVideo: this.enableVideo,
      }
      if (this.stunServer || this.turnServer) {
        this.rtcmConnection.iceServers = [] // clear all defaults
      }
      if (this.stunServer) {
        this.rtcmConnection.iceServers.push({
          urls: this.stunServer,
        })
      }
      if (this.turnServer) {
        const parse = this.turnServer.split('%')
        const username = parse[0].split('@')[0]
        const password = parse[0].split('@')[1]
        const turn = parse[1]
        this.rtcmConnection.iceServers.push({
          urls: turn,
          credential: password,
          username,
        })
      }
      this.rtcmConnection.onstream = (stream) => {
        const existing = this.videoList.find(
          (video) => video.id === stream.streamid
        )
        if (!existing) {
          this.videoList.push({
            id: stream.streamid,
            muted: stream.type === 'local',
            type: stream.type,
          })
        }
        Vue.nextTick(() => {
          if (this.$refs.localVideo.id === stream.streamid) {
            this.$refs.localVideo.srcObject = stream.stream
          } else {
            for (
              let i = 0, len = this.$refs.remoteVideos.length;
              i < len;
              i++
            ) {
              if (this.$refs.remoteVideos[i].id === stream.streamid) {
                this.$refs.remoteVideos[i].srcObject = stream.stream
                break
              }
            }
          }
        })
        this.$emit('joined-room', stream.streamid)
      }
      this.rtcmConnection.onstreamended = (stream) => {
        this.videoList = this.videoList.filter(
          (video) => video.id !== stream.streamid
        )
        this.$emit('left-room', stream.streamid)
      }
    },
    scanDevices() {
      return new Promise((resolve, reject) => {
        this.rtcmConnection.DetectRTC.load(() => {
          const devices = {
            audioInputDevices: [
              ...this.rtcmConnection.DetectRTC.audioInputDevices,
            ],
            videoInputDevices: [
              ...this.rtcmConnection.DetectRTC.videoInputDevices,
            ],
          }
          this.audioInputDevices = [...devices.audioInputDevices]
          this.videoInputDevices = [...devices.videoInputDevices]
          this.$emit('refreshed-devices', devices)
          resolve(devices)
        })
      })
    },
    join() {
      this.rtcmConnection.openOrJoin(this.roomId, (isRoomExist, roomid) => {
        if (isRoomExist === false && this.rtcmConnection.isInitiator === true) {
          this.$emit('opened-room', roomid)
        }
      })
    },
    leave() {
      if (!this.rtcmConnection) return
      this.rtcmConnection.attachStreams.forEach((localStream) =>
        localStream.stop()
      )
      this.videoList = []
    },
    capture() {
      const canvas = this.getCanvas()
      return canvas && canvas.toDataURL(this.screenshotFormat)
    },
    getCanvas() {
      const video = this.getCurrentVideo()
      if (video && !this.ctx) {
        const canvas = document.createElement('canvas')
        canvas.height = video.clientHeight
        canvas.width = video.clientWidth
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
      }
      const { ctx, canvas } = this
      if (!canvas) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas
    },
    getCurrentVideo() {
      return this.$refs.localVideo
    },
    shareScreen() {
      const that = this
      if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
        if (navigator.mediaDevices.getDisplayMedia) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: false })
            .then((stream) => {
              onGettingSteam(that, stream)
            }, getDisplayMediaError)
            .catch(getDisplayMediaError)
        } else if (navigator.getDisplayMedia) {
          navigator
            .getDisplayMedia({ video: true })
            .then((stream) => {
              onGettingSteam(that, stream)
            }, getDisplayMediaError)
            .catch(getDisplayMediaError)
        }
      }
    },
  },
}
</script>

<style scoped>
video {
  width: 100% !important;
}
</style>
