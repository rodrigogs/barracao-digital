<template>
  <div ref="history" class="chat-history">
    <v-row v-for="(message, index) in messages" :key="index">
      <v-spacer v-if="isMessageFromMe(message)"></v-spacer>
      <ConversationChatHistoryMessage
        :ref="`message-${index}`"
        :is-doctor="isDoctor"
        :doctor="doctor"
        :patient="patient"
        :message="message"
      />
    </v-row>
  </div>
</template>

<script>
import ConversationChatHistoryMessage from '~/components/conversation/ConversationChat/ConversationChatHistoryMessage'

export default {
  name: 'ConversationChatHistory',
  components: {
    ConversationChatHistoryMessage
  },
  props: {
    doctor: {
      type: Object,
      required: true
    },
    patient: {
      type: Object,
      required: true
    },
    isDoctor: {
      type: Boolean,
      required: true
    },
    messages: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    scrollDownTimeout: null
  }),
  watch: {
    messages() {
      this.scrollDown()
    }
  },
  mounted() {
    if (this.messages.length) this.scrollDown()
  },
  methods: {
    isMessageFromMe(message) {
      return this.isDoctor
        ? message.from === 'doctor'
        : message.from === 'patient'
    },
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
</style>
