<template>
  <div>
    <div ref="publisher"></div>
    <div
      v-for="stream of streams"
      :key="stream.streamId"
      :ref="`stream-${stream.streamId}`"
      @error="errorHandler"
    ></div>
  </div>
</template>

<script>
import Vue from 'vue'
import OT from '@opentok/client'

export default {
  name: 'OpentokSession',
  props: {
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    publisher: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    sessions: null,
    streams: []
  }),
  mounted() {
    this.openStream()
  },
  methods: {
    errorHandler(err) {
      this.$sentry.captureException(err)
    },
    opentokErrorDispatched(error) {
      this.$sentry.captureException(error)
    },
    openStream() {
      this.session = OT.initSession(process.env.OPENTOK_API_KEY, this.sessionId)

      this.session.connect(this.token, (err) => {
        if (err) {
          this.opentokErrorDispatched(err)
        }
      })

      this.session.on('sessionConnected', () => {
        this.sessionConnected()
      })

      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream)
        this.streamCreated(event.stream)
      })

      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream)
        if (idx > -1) {
          this.streams.splice(idx, 1)
        }
      })
    },
    sessionConnected() {
      this.publish()
    },
    streamCreated(stream) {
      this.subscribe(stream)
    },
    publish() {
      const publisher = OT.initPublisher(
        this.$refs.publisher,
        this.opts,
        (err) => {
          if (err) {
            this.errorHandler('error', err)
          }
        }
      )
      this.session.publish(publisher, (err) => {
        if (err) {
          this.errorHandler(err)
        }
      })
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
            }
          }
        )
      })
    }
  }
}
</script>
