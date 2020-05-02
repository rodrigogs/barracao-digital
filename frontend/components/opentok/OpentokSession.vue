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

      <div class="conversation">
        <div
          v-if="isVideoAllowed"
          v-show="isVideoReady"
          class="conversation__video secondary"
        >
          <div>
            <div
              v-for="stream of streams"
              :key="stream.streamId"
              :ref="`stream-${stream.streamId}`"
              class="conversation__subscriber"
              @error="errorHandler"
            ></div>
            <span ref="publisher" class="conversation__publisher"></span>
          </div>
        </div>

        <div class="conversation__chat">
          <!--<Chat></Chat>-->
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
import delay from '~/utils/promiseDelay'
/* import Chat from '~/components/chat/Chat' */

export default {
  name: 'ConversationSession',
  components: {
    /* Chat */
  },
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
    },
    isVideoAllowed: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    isLoading: true,
    isDeleting: false,
    session: null,
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
  mounted() {
    if (this.isVideoAllowed) {
      this.openStream()
    } else {
      this.isLoading = false
    }
  },
  methods: {
    deleteOpentokSession() {
      this.isDeleting = true
      const promises = [this.endSession, this.session.disconnect].map(
        (fn) => fn && fn()
      )
      Promise.all(promises).finally(() => {
        this.isDeleting = false
      })
      this.$emit('close')
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
    async sessionConnected() {
      if (this.publisher) {
        this.isLoading = false
        await this.waitForPatientVideo()
      }
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
        } else {
          this.published = true
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
        this.deleteOpentokSession()
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
            } else {
              this.subscribed = true
            }
          }
        )
      })
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
.conversation {
  --header-height: 56px;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - var(--header-height));
}

.conversation__video > div {
  position: relative;
  max-width: 400px;
  min-height: calc(50vh - var(--header-height));
  max-height: calc(50vh - var(--header-height));
  min-width: 50vh;
  max-width: 50vh;
  margin: 0 auto;
}

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

.conversation__chat {
  border: dashed 3px black;
  height: 100%;
}

@media screen and (min-width: 960px) {
  .conversation {
    --header-height: 64px;
  }
}

/* .video-container {
  margin-left: auto;
  margin-right: auto;
}

.subscriber {
  min-height: calc(50vh - 72px);
  max-height: calc(50vh - 72px);
  min-width: 50vh;
  max-width: 50vh;
  z-index: 8001;
}

.publisher {
  position: relative;
  float: right;
  min-height: 10vh;
  max-height: 10vh;
  min-width: 12vh;
  max-width: 13vh;
  margin-top: -10.5vh;
  margin-right: 0.5vw;
  z-index: 8002;
}

.chat {
  border: dashed black;
  min-height: calc(50vh - 72px);
  max-height: calc(50vh - 72px);
  min-width: 50vh;
  max-width: 50vh;
} */
</style>
