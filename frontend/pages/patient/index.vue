<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="8" lg="6">
        <v-card class="pa-4">
          <form @keydown.enter.prevent="validateForm">
            <v-text-field
              v-model="$v.ticket.$model"
              :error-messages="ticketErrors"
              label="Senha de retorno*"
              required
              autofocus
            ></v-text-field>

            <v-btn
              block
              class="mt-4"
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
              @click.native="validateForm"
            >
              Entrar
            </v-btn>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    ticket: '',
    isLoading: false
  }),
  validations: {
    ticket: {
      required
    }
  },
  computed: {
    ticketErrors() {
      const errors = []
      if (!this.$v.ticket.$dirty) return errors
      !this.$v.ticket.required &&
        errors.push('Por favor, digite a sua senha de retorno.')
      return errors
    }
  },
  methods: {
    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true
      this.$router.push(
        {
          name: 'patient-ticket',
          params: { ticket: this.ticket }
        },
        () => {
          this.isLoading = false
        }
      )
    }
  }
}
</script>
