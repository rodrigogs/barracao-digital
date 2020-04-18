<template>
  <v-container>
    <v-card max-width="500" class="mx-auto">
      <v-list-item>
        <v-list-item-avatar color="primary">
          <span class="white--text">{{ user.initials }}</span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ user.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-tabs class="mt-4" grow>
        <v-tab>
          <v-icon left>mdi-account</v-icon>
          Alterar perfil
        </v-tab>
        <v-tab>
          <v-icon left>mdi-lock</v-icon>
          Alterar senha
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <form>
                <v-row>
                  <v-col>
                    <v-text-field
                      id="username"
                      ref="usernameInput"
                      v-model="$v.profile.username.$model"
                      :error-messages="usernameErrors"
                      label="Nome de usuário*"
                      required
                    />
                    <v-text-field
                      id="email"
                      v-model="$v.profile.email.$model"
                      :error-messages="emailErrors"
                      name="email"
                      label="Email*"
                      type="email"
                      autocomplete="no"
                      required
                    />
                  </v-col>
                </v-row>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                class="mt-4"
                color="primary"
                :loading="isLoadingProfile"
                :disabled="isLoadingProfile || !$v.profile.$anyDirty"
                @click="validateAndSubmitProfile"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <form>
                <v-row>
                  <v-col>
                    <v-text-field
                      id="password"
                      v-model="$v.password.password.$model"
                      :error-messages="passwordErrors"
                      name="password"
                      label="Nova senha*"
                      type="password"
                      autocomplete="new_password"
                      required
                    />
                    <v-text-field
                      id="repeated-password"
                      v-model="$v.password.repeatedPassword.$model"
                      :error-messages="repeatedPasswordErrors"
                      name="repeated-password"
                      label="Confirmar senha*"
                      type="password"
                      autocomplete="new_password"
                      required
                    />
                  </v-col>
                </v-row>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                class="mt-4"
                color="primary"
                :loading="isLoadingPassword"
                :disabled="isLoadingPassword || !$v.password.$anyDirty"
                @click="validateAndSubmitPassword"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import getInitials from '~/utils/getInitials'

export default {
  middleware: 'auth',
  data: () => ({
    isLoadingProfile: false,
    isLoadingPassword: false,
    profile: {
      username: '',
      email: ''
    },
    password: {
      password: '',
      repeatedPassword: ''
    }
  }),
  computed: {
    user() {
      return {
        ...this.$auth.user,
        initials: getInitials(this.$auth.user.name)
      }
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.profile.username.$dirty) return errors
      !this.$v.profile.username.required &&
        errors.push('Por favor, digite o nome de usuário.')
      !this.$v.profile.username.minLength &&
        errors.push('O nome de usuário deve ter no mínimo 3 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.profile.email.$dirty) return errors
      !this.$v.profile.email.required &&
        errors.push('Por favor, digite o email.')
      !this.$v.profile.email.email &&
        errors.push('O email informado é inválido.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.password.$dirty) return errors
      !this.$v.password.password.required &&
        errors.push('Por favor, digite a senha.')
      !this.$v.password.password.minLength &&
        errors.push('A senha deve ter no mínimo 5 caracteres.')
      return errors
    },
    repeatedPasswordErrors() {
      const errors = []
      if (!this.$v.password.repeatedPassword.$dirty) return errors
      !this.$v.password.repeatedPassword.sameAsPassword &&
        errors.push('A senha digitada está diferente.')
      return errors
    }
  },
  validations: {
    profile: {
      username: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      }
    },
    password: {
      password: {
        required,
        minLength: minLength(5)
      },
      repeatedPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  mounted() {
    const { name, username, email } = this.user
    this.profile.name = name
    this.profile.username = username
    this.profile.email = email
  },
  methods: {
    validateAndSubmitProfile() {
      this.$v.profile.$touch()
      if (this.$v.profile.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoadingProfile = true

      this.$api
        .updateDoctor(this.user.username, this.profile)
        .then(
          () => this.$toast.success('Perfil atualizado com sucesso!'),
          () =>
            this.$toast.error(
              'Ocorreu um erro ao tentar atualizar o seu perfil, tente novamente mais tarde'
            )
        )
        .finally(() => {
          this.isLoadingProfile = false
        })
    },
    validateAndSubmitPassword() {
      this.$v.password.$touch()
      if (this.$v.password.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoadingPassword = true

      this.$api
        .updateDoctor(this.user.username, {
          password: this.password.password
        })
        .then(
          () => {
            this.$toast.success('Senha atualizada com sucesso!')
            this.$v.password.$reset()
            this.password = {
              password: '',
              repeatedPassword: ''
            }
          },
          () =>
            this.$toast.error(
              'Ocorreu um erro ao tentar atualizar a sua senha, tente novamente mais tarde'
            )
        )
        .finally(() => {
          this.isLoadingPassword = false
        })
    }
  }
}
</script>
