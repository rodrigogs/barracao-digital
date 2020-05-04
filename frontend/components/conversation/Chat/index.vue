<template>
  <v-card class="fill-height d-flex flex-column elevation-4" flat>
    <v-card-text class="history fill-height d-flex flex-column grey lighten-5">
      <ChatHistory
        :is-doctor="isDoctor"
        :doctor="doctor"
        :patient="patient"
        :messages="messages"
        class="pa-2 ma-1 flex-grow-1"
      />
    </v-card-text>
    <v-card-actions class="actions blue-grey lighten-5">
      <ChatActions @send="sendMessage" />
    </v-card-actions>
  </v-card>
</template>

<script>
import ChatActions from './ChatActions'
import ChatHistory from './ChatHistory'

export default {
  name: 'Chat',
  components: {
    ChatActions,
    ChatHistory
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
.actions {
  padding: 0 5vh 1vh 5vh;
}
</style>
