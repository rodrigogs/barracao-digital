<template>
  <div class="black">
    <div
      v-for="stream of streams"
      :key="stream.streamId"
      :ref="`stream-${stream.streamId}`"
      class="conversation__subscriber"
      @error="errorHandler"
    ></div>
    <span ref="publisher" class="conversation__publisher"></span>

    <v-overlay absolute :value="!isVideoReady">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import Vue from 'vue'
import OT from '@opentok/client'
import delay from '~/utils/promiseDelay'
import { OPENTOK_API_KEY } from '~/config'

export default {
  name: 'ConversationVideo',
  props: {
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    isPublisher: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    isLoading: true,
    isDeleting: false,
    session: null,
    publisher: null,
    published: false,
    subscribed: false,
    streams: []
  }),
  computed: {
    isVideoReady() {
      return (
        this.session && this.streams.length && this.published && this.subscribed
      )
    }
  },
  watch: {
    isVideoReady() {
      this.$emit('video-ready', this.isVideoReady)
    }
  },
  mounted() {
    this.openStream()
  },
  beforeDestroy() {
    return this.disconnect()
  },
  methods: {
    errorHandler(err) {
      this.$sentry.captureException(err)
      this.$toast.error(
        'Ocorreu um erro ao tentar iniciar chat por video, por favor tente recarregar a página.'
      )
    },
    openStream() {
      this.session = OT.initSession(OPENTOK_API_KEY, this.sessionId)

      this.session.connect(this.token, (err) => {
        if (err) {
          this.errorHandler(err)
        }
      })

      this.session.on('sessionConnected', this.sessionConnected.bind(this))
      this.session.on('streamCreated', this.streamCreated.bind(this))
      this.session.on('streamDestroyed', this.streamDestroyed.bind(this))
    },
    async sessionConnected() {
      if (this.published) return
      if (this.isPublisher) {
        this.isLoading = false
        await this.waitForPatientVideo()
      }
      this.publisher = OT.initPublisher(
        this.$refs.publisher,
        this.opts,
        (err) => {
          if (err) {
            this.errorHandler('error', err)
          } else {
            this.isLoading = false
          }
        }
      )

      this.session.publish(this.publisher, (err) => {
        if (err) {
          this.errorHandler(err)
        } else {
          this.published = true
        }
      })
    },
    streamCreated({ stream }) {
      if (this.streams.length > 0) return
      this.streams.push(stream)
      this.subscribe(stream)
    },
    streamDestroyed({ stream }) {
      const index = this.streams.indexOf(stream)
      if (index > -1) {
        this.$delete(this.streams, index)
      }
      this.disconnect()
      this.$emit('disconnection')
    },
    subscribe(stream) {
      Vue.nextTick(() => {
        this.session.subscribe(
          stream,
          this.$refs[`stream-${stream.streamId}`][0],
          this.opts,
          (err) => {
            if (err) {
              this.errorHandler('error', err)
            } else {
              this.subscribed = true
            }
          }
        )
      })
    },
    async disconnect() {
      try {
        if (this.session) {
          // eslint-disable-next-line no-console
          console.log('Disconnecting stream')
          if (this.publisher) await this.session.unpublish(this.publisher)
          this.publisher = null
          // eslint-disable-next-line no-console
          console.log('Disconnecting subscription')
          await this.session.disconnect()
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Disconnection failed`, err)
      }
    },
    async waitForPatientVideo() {
      do {
        await delay(1000)
      } while (!this.streams.length)
    }
  }
}
</script>

<style scoped>
.conversation__subscriber {
  min-height: calc(50vh - var(--header-height));
  max-height: calc(50vh - var(--header-height));
  min-width: 50vh;
  max-width: 50vh;
}

.conversation__publisher {
  position: absolute;
  right: 0;
  bottom: 0;
  min-height: 10vh;
  max-height: 10vh;
  min-width: 12vh;
  max-width: 13vh;
  z-index: 100;
}
</style>
