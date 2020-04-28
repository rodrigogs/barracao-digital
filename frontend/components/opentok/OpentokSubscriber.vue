<template>
  <div>
    <div v-for="stream in streams" :key="stream.streamId">
      <OpentokSubscriberUser
        :stream="stream"
        :session="session"
        @error="opentokErrorDispatched"
      />
    </div>
  </div>
</template>

<script>
import OT from '@opentok/client'
import OpentokSubscriberUser from '@/components/opentok/OpentokSubscriberUser'

export default {
  name: 'OpentokSubscriber',
  components: {
    OpentokSubscriberUser
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
