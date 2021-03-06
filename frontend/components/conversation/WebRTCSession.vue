<template>
  <v-container class="pa-0 ma-0">
    <video
      v-for="item in remoteVideos"
      :id="item.id"
      :key="item.id"
      ref="remoteVideos"
      class="remote-video"
      controls
      autoplay
      playsinline
      :height="cameraHeight"
      :muted="item.muted"
    />
    <video
      v-if="localVideo"
      :id="localVideo.id"
      ref="localVideo"
      class="local-video"
      controls
      autoplay
      playsinline
      :height="cameraHeight"
      :muted="localVideo.muted"
    />
    <!--    <v-menu
      v-model="inputConfigsMenu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-combobox
                v-model="selectedVideoInputDevice"
                :items="videoInputDevices"
                item-text="label"
                label="Entradas de vídeo"
              />
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-combobox
                v-model="selectedAudioInputDevice"
                :items="audioInputDevices"
                item-text="label"
                item-value="id"
                label="Entradas de áudio"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>-->
  </v-container>
</template>

<script>
import 'adapterjs'
import Vue from 'vue'
import RTCMultiConnection from 'rtcmulticonnection'
import * as io from 'socket.io-client'

window.io = io // FIXME https://github.com/westonsoftware/vue-webrtc/issues/5

const addStreamStopListener = (stream, callback) => {
  let streamEndedEvent = 'ended'
  if ('oninactive' in stream) {
    streamEndedEvent = 'inactive'
  }
  stream.addEventListener(streamEndedEvent, callback, false)
}

const onGettingSteam = (that) => (stream) => () => {
  that.rtcmConnection.addStream(stream)
  that.$emit('share-started', stream.streamid)

  addStreamStopListener(stream, () => {
    that.rtcmConnection.removeStream(stream.streamid)
    that.$emit('share-stopped', stream.streamid)
  })
}

const getDisplayMediaError = (error) => {
  this.$noty.error(`Ocorreu um erro ao tentar compartilhar sua tela.
${error.message}`)
  throw error
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
  },
  data() {
    return {
      rtcmConnection: null,
      audioInputDevices: [],
      videoInputDevices: [],
      videoList: [],
      streams: [],
      players: {},
      canvas: null,
      ctx: null,
      inputConfigsMenu: null,
      selectedVideoInputDevice: null,
      selectedAudioInputDevice: null,
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
  watch: {
    selectedVideoInputDevice() {
      this.rtcmConnection.applyConstraints({
        video: { deviceId: this.selectedVideoInputDevice.deviceId },
      })
    },
    selectedAudioInputDevice() {
      this.rtcmConnection.applyConstraints({
        audio: { deviceId: this.selectedAudioInputDevice.deviceId },
      })
    },
  },
  async mounted() {
    this.configure()
    await this.scanDevices()
    this.selectedVideoInputDevice = this.videoInputDevices[0]
    this.selectedAudioInputDevice =
      this.audioInputDevices.find(
        (aid) => aid.id === 'default' || aid.deviceId === 'default'
      ) || this.audioInputDevices[0]
    this.join()
  },
  beforeDestroy() {
    this.leave()
  },
  methods: {
    configure() {
      this.rtcmConnection = new RTCMultiConnection()
      this.rtcmConnection.socketURL = this.socketURL
      this.rtcmConnection.autoCreateMediaElement = false
      this.rtcmConnection.enableLogs = this.enableLogs
      this.rtcmConnection.mediaConstraints = {
        audio: this.enableAudio,
        video: this.enableVideo,
      }
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.enableAudio,
        OfferToReceiveVideo: this.enableVideo,
      }
      this.rtcmConnection.iceServers = [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp',
          ],
        },
      ]
      this.rtcmConnection.onstream = (stream) => {
        this.streams.push(stream)
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
        Vue.nextTick(() => this.refreshStreams())
        this.$emit('joined-room', stream.streamid)
      }
      this.rtcmConnection.onstreamended = (stream) => {
        const streamIndex = this.streams.findIndex(
          ({ streamid }) => stream.streamid === streamid
        )
        if (streamIndex > -1) this.streams.splice(streamIndex, 1)
        this.videoList = this.videoList.filter(
          (video) => video.id !== stream.streamid
        )
        Vue.nextTick(() => this.refreshStreams())
        this.$emit('left-room', stream.streamid)
      }
      this.rtcmConnection.onSettingLocalDescription = () => {
        this.refreshStreams()
      }
    },
    refreshStreams() {
      const videoElements = [
        this.$refs.localVideo,
        ...(this.$refs.remoteVideos || []),
      ].filter((item) => !!item)
      for (const videoElement of videoElements) {
        const stream = this.streams.find((s) => s.streamid === videoElement.id)
        if (stream && !this.players[videoElement.id]) {
          videoElement.srcObject = stream.stream
        }
      }
    },
    scanDevices() {
      return new Promise((resolve) => {
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
      if (!this.videoInputDevices.length) {
        return this.$emit('video-not-available')
      }
      if (!this.audioInputDevices.length) {
        return this.$emit('audio-not-available')
      }
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
              onGettingSteam(that, stream, this.getCurrentVideo())
            }, getDisplayMediaError)
            .catch(getDisplayMediaError)
        } else if (navigator.getDisplayMedia) {
          navigator
            .getDisplayMedia({ video: true })
            .then((stream) => {
              onGettingSteam(that, stream, this.getCurrentVideo())
            }, getDisplayMediaError)
            .catch(getDisplayMediaError)
        } else {
          this.$noty.error(
            'O seu navegador não disponibiliza este recurso. Tente utilizar um navegador atualizado.'
          )
        }
      }
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

video.remote-video {
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  position: absolute;
}

video.local-video {
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
