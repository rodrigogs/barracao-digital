<template>
  <div>
    <OpentokPublisher v-if="session" :session="session" @error="errorHandler" />
    <div v-for="stream in streams" :key="stream.streamId">
      <OpentokSubscriber
        :stream="stream"
        :session="session"
        @error="opentokErrorDispatched"
      />
    </div>
  </div>
</template>

<script>
import OT from '@opentok/client'
import OpentokPublisher from '@/components/opentok/OpentokPublisher'
import OpentokSubscriber from '@/components/opentok/OpentokSubscriber'

export default {
  name: 'OpentokSession',
  components: {
    OpentokPublisher,
    OpentokSubscriber
  },
  props: {
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  data: () => ({
    session: null,
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

      this.session.on('streamCreated', (event) => {
        console.log(event)
        this.streams.push(event.stream)
      })

      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream)
        if (idx > -1) {
          this.streams.splice(idx, 1)
        }
      })
    }
  }
}
</script>
