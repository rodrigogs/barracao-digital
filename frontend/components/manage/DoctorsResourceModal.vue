<template>
  <v-dialog :value="doctor" max-width="800" @click:outside="$emit('close')">
    <v-card>
      <v-card-title v-if="isCreating" class="headline align-start">
        Criar novo médico
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-title v-else class="headline align-start">
        #{{ doctor.username }}
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <form>
          <v-row>
            <v-col cols="12" sm="6">
              <StatesAutocomplete
                id="fu"
                v-model="$v.form.fu.$model"
                :error-messages="fuErrors"
                name="fu"
                label="Estado*"
                autofocus
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="crm"
                v-model="$v.form.crm.$model"
                v-mask="'########'"
                :error-messages="crmErrors"
                :loading="checkingCrm"
                name="crm"
                label="CRM*"
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="name"
                v-model="$v.form.name.$model"
                :error-messages="nameErrors"
                label="Nome*"
                required
                readonly
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="specialty"
                v-model="$v.form.specialty.$model"
                :error-messages="specialtyErrors"
                label="Especialidade"
                readonly
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="username"
                ref="usernameInput"
                v-model="$v.form.username.$model"
                :error-messages="usernameErrors"
                label="Nome de usuário*"
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="password"
                v-model="$v.form.password.$model"
                :error-messages="passwordErrors"
                name="password"
                label="Senha*"
                type="password"
                autocomplete="new_password"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="email"
                v-model="$v.form.email.$model"
                :error-messages="emailErrors"
                name="email"
                label="Email*"
                type="email"
                autocomplete="no"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                id="cep"
                v-model="$v.form.cep.$model"
                v-mask="'#####-###'"
                :error-messages="cepErrors"
                name="cep"
                label="CEP da instalação*"
                autocomplete="no"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="6" sm="3">
              <v-switch
                id="admin"
                v-model="form.admin"
                name="admin"
                label="Admin?"
              ></v-switch>
            </v-col>

            <v-col cols="6" sm="3">
              <v-switch
                id="master"
                v-model="form.master"
                name="master"
                label="Master?"
              ></v-switch>
            </v-col>
          </v-row>
        </form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          class="mt-4"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading || !validCrm"
          @click="validateAndSubmit"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import { zip } from '~/utils/validations'
import crm from '~/utils/crm'
import debounce from '~/utils/debounce'
import unmaskText from '~/utils/unmaskText'
import StatesAutocomplete from '~/components/StatesAutocomplete'

export default {
  name: 'DoctorsResourceModal',
  components: {
    StatesAutocomplete
  },
  props: {
    doctor: {
      type: Object,
      required: true
    },
    submit: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    isCreating: false,
    isLoading: false,
    doctors: [],
    checkingCrm: false,
    validCrm: false,
    form: {
      username: '',
      sort: '',
      name: '',
      specialty: '',
      password: '',
      cep: '',
      email: '',
      fu: '',
      crm: null,
      master: false,
      admin: false
    }
  }),
  computed: {
    fuErrors() {
      const errors = []
      if (!this.$v.form.fu.$dirty) return errors
      !this.$v.form.fu.required && errors.push('Por favor, selecione o estado.')
      return errors
    },
    crmErrors() {
      const errors = []
      if (!this.$v.form.crm.$dirty) return errors
      !this.$v.form.crm.required && errors.push('Por favor, digite o CRM.')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Por favor, digite o nome.')
      return errors
    },
    specialtyErrors() {
      const errors = []
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.required &&
        errors.push('Por favor, digite o nome de usuário.')
      !this.$v.form.username.minLength &&
        errors.push('O nome de usuário deve ter no mínimo 3 caracteres.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required &&
        errors.push('Por favor, digite a senha.')
      !this.$v.form.password.minLength &&
        errors.push('A senha deve ter no mínimo 5 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required && errors.push('Por favor, digite o email.')
      !this.$v.form.email.email && errors.push('O email informado é inválido.')
      return errors
    },
    cepErrors() {
      const errors = []
      if (!this.$v.form.cep.$dirty) return errors
      !this.$v.form.cep.required &&
        errors.push('Por favor, digite o CEP da instalação.')
      !this.$v.form.cep.zip && errors.push('O CEP informado é inválido.')
      return errors
    }
  },
  watch: {
    'form.fu'() {
      this.checkCrm()
    },
    'form.crm'() {
      this.checkCrm()
    }
  },
  mounted() {
    if (!this.doctor.username) this.isCreating = true
    this.pupulateFormInfo({
      ...this.doctor,
      cep: this.doctor.cep || this.$auth.user.cep
    })
  },
  validations: {
    form: {
      fu: {
        required
      },
      crm: {
        required
      },
      name: {
        required
      },
      specialty: {},
      username: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(5)
      },
      email: {
        required,
        email
      },
      cep: {
        required,
        zip
      }
    }
  },
  methods: {
    pupulateFormInfo(newInfo) {
      this.form = { ...this.form, ...newInfo }
    },

    checkCrm: debounce(async function checkCrm() {
      if (this.checkingCrm || !this.form.fu || !this.form.crm) return
      try {
        this.validCrm = false
        this.checkingCrm = true
        const crmInfo = await crm.retrieve(this.form.fu, this.form.crm)
        const crmError = crm.validate(crmInfo)

        if (crmError) return this.$toast.error(crmError)

        this.validCrm = true
        this.pupulateFormInfo({
          name: crmInfo.nome,
          specialty: crmInfo.especialidade
        })
        this.$refs.usernameInput.focus()
      } catch (err) {
        this.$toast.error(
          'Ocorreu um erro ao verificar o CRM do médico, tente novamente mais tarde.'
        )
        throw err
      } finally {
        this.checkingCrm = false
      }
    }, 800),

    validateAndSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true

      const doctor = {
        ...this.form,
        cep: unmaskText(this.form.cep)
      }

      return this.submit(this.isCreating, doctor)
        .then(
          () => this.$emit('close'),
          (error) => error
        )
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
