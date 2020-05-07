<template>
  <div class="chat-actions">
    <v-form ref="form" class="action-text" lazy-validation @submit.prevent="">
      <v-text-field
        ref="input"
        v-model="text"
        type="text"
        placeholder="Digite sua mensagem"
        counter
        autofocus
        clearable
        append-icon="mdi-send"
        :loading="loading"
        @keyup.enter="send"
        @click:append="send"
      >
      </v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'ConversationChatActions',
  props: {
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    text: ''
  }),
  methods: {
    send() {
      if (this.text === '') return
      this.$emit('send', this.text)
      this.text = ''
    }
  }
}
</script>

<style scoped>
.chat-actions {
  width: 100%;
  min-height: 70px;
}
</style>
