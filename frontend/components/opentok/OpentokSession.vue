<template>
  <v-dialog
    :value="true"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="video-chat">
        <div class="publisher" ref="publisher"></div>

        <div class="subscribers">
          <div
            v-for="stream of streams"
            :key="stream.streamId"
            :ref="`stream-${stream.streamId}`"
            @error="errorHandler"
          ></div>
        </div>
      </div>
    </v-card>
  </v-dialog>
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

      this.session.on('sessionConnected', this.sessionConnected.bind(this))
      this.session.on('streamCreated', this.streamCreated.bind(this))
      this.session.on('streamDestroyed', this.streamDestroyed.bind(this))
    },
    sessionConnected() {
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
    streamCreated({ stream }) {
      this.streams.push(stream)
      this.subscribe(stream)
    },
    streamDestroyed({ stream }) {
      const index = this.streams.indexOf(stream)
      if (index > -1) {
        this.$delete(this.streams, index)
      }
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

<style scoped>
.video-chat {
  display: grid;
  grid-template-rows: 1fr 1fr;
  min-height: calc(100vh - 56px);
}

.video-chat > .publisher {
  grid-row: 1 / 2;
  width: 100% !important;
  height: 100% !important;
}

.video-chat > .subscribers {
  grid-row: 2 / 3;
  width: 100% !important;
  height: 100% !important;

  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.subscribers > * {
  width: 100% !important;
  height: 100% !important;
}
</style>
