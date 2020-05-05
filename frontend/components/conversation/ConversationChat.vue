<template>
  <v-card class="conversation-chat elevation-4" flat>
    <ConversationChatHistory
      class="grey lighten-5 conversation-chat__history"
      :is-doctor="isDoctor"
      :doctor="doctor"
      :patient="patient"
      :messages="messages"
    />
    <v-card-actions class="blue-grey lighten-5">
      <ConversationChatActions @send="sendMessage" />
    </v-card-actions>
  </v-card>
</template>

<script>
import ConversationChatActions from '~/components/conversation/ConversationChat/ConversationChatActions'
import ConversationChatHistory from '~/components/conversation/ConversationChat/ConversationChatHistory'

export default {
  name: 'ConversationChat',
  components: {
    ConversationChatActions,
    ConversationChatHistory
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
    }
  },
  data: () => ({
    messages: []
  }),
  computed: {
    messagesQuery() {
      return this.$fireStore
        .collection('facilities')
        .doc(this.doctor.cep)
        .collection('conversations')
        .doc(`${this.doctor.username}#${this.patient.ticket}`)
        .collection('messages')
    }
  },
  mounted() {
    this.syncMessages()
  },
  destroyed() {
    this.messagesSubscription && this.messagesSubscription()
  },
  methods: {
    syncMessages() {
      this.messagesSubscription = this.messagesQuery.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const doc = change.doc.data()
          this.messages.push(doc)
        })
      })
    },
    sendMessage(text) {
      const message = {
        from: this.isDoctor ? 'doctor' : 'patient',
        patient: this.patient.ticket,
        doctor: this.doctor.username,
        timestamp: Date.now(),
        text
      }
      return this.messagesQuery.doc(String(message.timestamp)).set(message)
    }
  }
}
</script>

<style scoped>
.conversation-chat {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  max-height: 100%;
  overflow-y: scroll;
}

.conversation-chat__history {
  padding: 1rem;
  height: 100%;
}
</style>
