<template>
  <div ref="history" class="chat-history">
    <v-row v-for="(message, index) in messages" :key="index">
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
  computed: {
    noMessages() {
      return !this.messages || !this.messages.length
    }
  },
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
        if (this.$refs.history)
          this.$refs.history.scrollTop = this.$refs.history.scrollHeight
        clearTimeout(this.scrollDownTimeout)
      }, 400)
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #c0c0c0;
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  background: #dddddd;
  border-radius: 0;
}
.chat-history {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
