<template>
  <v-card class="conversation-chat" tile width="100%">
    <ConversationChatHistory
      class="conversation-chat__history"
      :is-doctor="isDoctor"
      :doctor="doctor"
      :patient="patient"
      :messages="messages"
    />
    <v-card-actions class="conversation-chat__actions grey lighten-3">
      <ConversationChatActions @send="newMessage" />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ConversationChatActions from '~/components/conversation/ConversationChat/ConversationChatActions'
import ConversationChatHistory from '~/components/conversation/ConversationChat/ConversationChatHistory'
import promiseDelay from '~/utils/promiseDelay'

export default {
  name: 'ConversationChat',
  components: {
    ConversationChatActions,
    ConversationChatHistory,
  },
  props: {
    doctor: {
      type: Object,
      required: true,
    },
    patient: {
      type: Object,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters('chat', {
      isReady: 'isReady',
      messages: 'getMessages',
    }),
  },
  watch: {
    isReady() {
      if (this.isReady && this.isDoctor && !this.messages.length)
        this.sendHintMessages()
    },
  },
  mounted() {
    this.subscribeToMessages({
      originCep: this.patient.originCep,
      doctorUsername: this.doctor.username,
      patientTicket: this.patient.ticket,
    })
  },
  methods: {
    ...mapActions('chat', ['subscribeToMessages', 'sendMessage']),
    async sendHintMessages() {
      await this.newMessage('Olá. Bem vindo(a) ao Barracão Digital!')
      await promiseDelay(500)
      await this.newMessage('Vamos começar o seu atendimento')
      await promiseDelay(500)
      await this.newMessage('Como você está se sentindo hoje?')
    },
    newMessage(text) {
      return this.sendMessage({
        from: this.isDoctor ? 'doctor' : 'patient',
        originCep: this.patient.originCep,
        patientTicket: this.patient.ticket,
        doctorUsername: this.doctor.username,
        text,
      })
    },
  },
}
</script>

<style scoped>
.conversation-chat {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.conversation-chat__history {
  padding: 1rem;
}
</style>
