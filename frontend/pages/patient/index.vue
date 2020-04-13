<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="8" lg="6">
        <v-card class="pa-4">
          <form @keydown.enter.prevent="validateForm">
            <v-text-field
              v-model="$v.ticket.$model"
              v-mask="'XXXXXXXXX'"
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
import { mask } from 'vue-the-mask'
import { required } from 'vuelidate/lib/validators'

export default {
  directives: { mask },
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
    async checkPatient() {
      try {
        await this.$api.searchPatientByTicket(this.ticket)
        return true
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.$toast.error('Não existe um paciente cadastrado para esta senha')
        }
        return false
      }
    },

    async validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true

      if (!(await this.checkPatient())) {
        this.isLoading = false
        return
      }

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
