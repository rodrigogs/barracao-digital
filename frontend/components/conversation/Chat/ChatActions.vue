<template>
  <div class="chat-actions">
    <v-form ref="form" class="action-text" lazy-validation>
      <v-text-field
        ref="input"
        v-model="message"
        type="text"
        placeholder="Digite sua mensagem"
        counter
        autofocus
        clearable
        append-outer-icon="mdi-send"
        :loading="loading"
        @keyup.enter="send"
        @click:append-outer="send"
      >
      </v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'ChatActions',
  data: () => ({
    message: '',
    loading: false
  }),
  methods: {
    async send() {
      if (this.loading) return
      const { cursor, section, subsection, message } = this
      try {
        this.loading = true
        await this.$store.dispatch('chat/sendMessage', {
          cursor,
          section,
          subsection,
          message
        })
        this.message = { from: 'me', content: '' }
      } finally {
        this.loading = false
      }
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
