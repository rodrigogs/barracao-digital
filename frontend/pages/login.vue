<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="6" md="4">
        <v-card class="pa-4">
          <form @keydown.enter.prevent="validateForm">
            <v-text-field
              v-model="$v.username.$model"
              :error-messages="usernameErrors"
              label="Usuário*"
              required
              autofocus
            ></v-text-field>

            <v-text-field
              v-model="$v.password.$model"
              :error-messages="passwordErrors"
              label="Senha*"
              type="password"
              required
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
import * as R from 'ramda'
import { required } from 'vuelidate/lib/validators'

export default {
  middleware: 'guest',
  data: () => ({
    username: '',
    password: '',
    isLoading: false
  }),
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  computed: {
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required &&
        errors.push('Por favor, digite o seu usuário.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required &&
        errors.push('Por favor, digite a sua senha.')
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
      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .then(
          () => {
            this.$toast.success('Login efetuado com sucesso')
            return this.$router.push({
              name: 'doctor'
            })
          },
          (error) => {
            const status = R.path(['response', 'status'], error)

            if (status && status === 401)
              this.$toast.error('Usuário ou senha incorretos.')
            else
              this.$toast.error(
                'Ocorreu um erro durante a autenticação, tente novamente mais tarde'
              )
          }
        )
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
