<template>
  <div class="chat-actions">
    <v-form ref="form" class="action-text" lazy-validation>
      <v-text-field
        ref="input"
        v-model="text"
        type="text"
        placeholder="Digite sua mensagem"
        counter
        autofocus
        clearable
        append-outer-icon="mdi-send"
        :loading="loading"
        @keyup.enter="$emit('send', text)"
        @click:append-outer="$emit('send', text)"
      >
      </v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'ChatActions',
  props: {
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    text: ''
  })
}
</script>

<style scoped>
.chat-actions {
  width: 100%;
  min-height: 70px;
}
</style>
