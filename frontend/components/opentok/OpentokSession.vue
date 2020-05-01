<template>
  <v-dialog
    :value="true"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-spacer />
        <v-btn
          v-if="endSession"
          :loading="isDeleting"
          :disabled="isDeleting"
          light
          @click="deleteOpentokSession"
        >
          Encerrar
        </v-btn>
      </v-toolbar>

      <div class="video-chat">
        <div ref="publisher" class="publisher"></div>

        <div class="subscribers">
          <div
            v-for="stream of streams"
            :key="stream.streamId"
            :ref="`stream-${stream.streamId}`"
            @error="errorHandler"
          ></div>
        </div>

        <v-overlay absolute :value="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-overlay>
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
    },
    endSession: {
      type: Function,
      required: false,
      default: null
    }
  },
  data: () => ({
    isLoading: true,
    isDeleting: false,
    sessions: null,
    streams: []
  }),
  mounted() {
    this.openStream()
  },
  methods: {
    deleteOpentokSession() {
      this.isDeleting = true
      Promise.all([this.endSession(), this.session.disconnect()]).finally(
        () => {
          this.isDeleting = false
        }
      )
    },
    errorHandler(err) {
      this.$sentry.captureException(err)
      this.$toast.error(
        'Ocorreu um erro ao tentar iniciar chat por video, por favor tente recarregar a página.'
      )
    },
    openStream() {
      this.session = OT.initSession(process.env.OPENTOK_API_KEY, this.sessionId)

      this.session.connect(this.token, (err) => {
        if (err) {
          this.errorHandler(err)
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
          } else {
            this.isLoading = false
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
  position: relative;
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
