<template>
  <div ref="history" class="chat-history">
    <v-row v-for="(message, index) in messages" :key="index">
      <v-spacer v-if="message.from === 'me'"></v-spacer>
      <ChatMessage :ref="`message-${index}`" :message="message"></ChatMessage>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatMessage from './ChatMessage.vue'

export default {
  name: 'ChatHistory',
  components: {
    ChatMessage
  },
  data: () => ({
    scrollDownTimeout: null
  }),
  computed: {
    ...mapGetters('chat', {
      messages: 'sortedMessages'
    })
  },
  watch: {
    messages() {
      this.scrollDown()
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.messages.length) this.scrollDown()
    })
  },
  methods: {
    scrollDown() {
      if (this.scrollDownTimeout) clearTimeout(this.scrollDownTimeout)
      this.scrollDownTimeout = setTimeout(() => {
        this.$refs.history.scrollTop = this.$refs.history.scrollHeight
        clearTimeout(this.scrollDownTimeout)
      }, 400)
    }
  }
}
</script>

<style scoped>
.chat-history {
  overflow-y: auto;
  overflow-x: hidden;
}
@media screen and (max-width: 959px) {
  .chat-history {
    height: calc(100vh - 346px);
  }
}
@media screen and (min-width: 960px) {
  .chat-history {
    height: calc(100vh - 354px);
  }
}
</style>
