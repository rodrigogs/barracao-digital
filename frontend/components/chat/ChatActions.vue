<template lang="pug">
  .chat-actions

    v-form(ref="form" lazy-validation).action-text
      v-text-field(
        type="text"
        placeholder="Digite sua mensagem"
        counter
        autofocus
        clearable
        ref="input"
        :append-outer-icon="outerIcon"
        v-model="message"
        v-on:keyup.enter="send"
        @click:append-outer="send"
        :loading="loading"
      )
</template>

<script>
import { mapGetters } from 'vuex'
import ActionText from './ActionText.vue'
import ActionNumber from './ActionNumber.vue'
import ActionCep from './ActionCep.vue'
import ActionNationality from './ActionNationality.vue'
import ActionChoice from './ActionChoice.vue'
import ActionCpf from './ActionCpf.vue'
import ActionState from './ActionState.vue'
import ActionPhone from './ActionPhone.vue'
export default {
  name: 'ChatActions',
  components: {
    ActionCpf,
    ActionText,
    ActionNumber,
    ActionCep,
    ActionNationality,
    ActionChoice,
    ActionState,
    ActionPhone
  },
  data: () => ({
    message: {
      from: 'me',
      mask: undefined,
      content: undefined
    },
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
        this.message = { from: 'me', mask: undefined, content: undefined }
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    rules() {
      return [
        (value) => {
          if (!this.config.required) return true
          return !!value || 'Resposta obrigatória'
        },
        (value) => {
          if (!this.config.minLength) return true
          return (
            (!!value && String(value).length >= this.config.minLength) ||
            `O tamanho mínimo deste campo é ${this.config.minLength}`
          )
        },
        (value) => {
          if (!this.config.maxLength) return true
          return (
            (!!value && String(value).length <= this.config.maxLength) ||
            `O tamanho máximo deste campo é ${this.config.maxLength}`
          )
        }
      ]
    },
    ...mapGetters('chat', {
      cursor: 'cursor',
      section: 'section',
      subsection: 'subsection',
      config: 'config'
    })
  },
  watch: {
    config(config) {
      // FIXME create a generic component to ask user if the suggestion is ok
      if (config) this.message.content = config.suggestion
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
