<template>
  <v-card v-if="!isConsentAccepted" elevation="0" max-width="600">
    <v-card-text
      class="text-center grey--text text--darken-4 title font-weight-regular"
    >
      <p class="content-title">
        <b>Adesão para pacientes:</b>
      </p>

      <p>
        Estou ciente de que a plataforma “BARRACÃO DIGITAL” decorre de ação de
        voluntários com vistas a proporcionar atendimento remoto por
        profissionais da saúde. Trata-se de medida paliativa e alternativa com
        regramento legal pertinente que objetiva proporcionar auxílio sem ônus,
        mas com as limitações e circunstâncias pertinentes e decorrentes, às
        quais me submeto sob conta e risco.
      </p>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn color="primary" x-large @click.native="acceptConsent">
        Aceitar e continuar
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>
    <v-stepper v-model="step" vertical>
      <v-stepper-step step="1" :complete="step > 1">
        <span class="title">Seus dados</span>
        <span>Preencha seus dados para direcionarmos seu atendimento</span>
      </v-stepper-step>
      <v-stepper-content step="1">
        <form @keydown.enter.prevent="validateMyDataSection">
          <v-text-field
            id="name"
            v-model="$v.myData.name.$model"
            :error-messages="nameErrors"
            label="Nome*"
            required
            autofocus
          ></v-text-field>

          <v-text-field
            id="age"
            v-model="$v.myData.age.$model"
            :error-messages="ageErrors"
            label="Idade*"
            type="number"
            required
          ></v-text-field>

          <v-text-field
            id="cpf"
            v-model="$v.myData.cpf.$model"
            v-mask="'###.###.###-##'"
            :error-messages="cpfErrors"
            label="CPF*"
            required
          ></v-text-field>

          <v-text-field
            id="cep"
            v-model="$v.myData.cep.$model"
            v-mask="'#####-###'"
            :error-messages="cepErrors"
            label="CEP*"
            required
          ></v-text-field>

          <div class="mt-2">
            <span>Caso não saiba seu CEP,</span>
            <a
              href="http://www.buscacep.correios.com.br/sistemas/buscacep/BuscaCepEndereco.cfm"
              target="_blank"
              >clique aqui</a
            >
          </div>

          <v-btn
            id="myDataBtn"
            class="mt-4"
            color="primary"
            @click.native="validateMyDataSection"
          >
            Próximo
          </v-btn>
        </form>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="step > 2">
        <span class="title">Informações médicas</span>
        <span>Informe sobre sua situação médica</span>
      </v-stepper-step>
      <v-stepper-content step="2">
        <form @keydown.enter.prevent="step = 3">
          <v-text-field
            id="meds"
            v-model="medicalInformations.meds"
            label="Você faz uso de algum remédio todos os dias? Quais?"
            hint="Exemplo: Enalapril, Metformina, AAS"
            autofocus
          ></v-text-field>

          <v-text-field
            id="allergies"
            v-model="medicalInformations.allergies"
            label="Você tem alguma alergia? Quais?"
            hint="Exemplo: Dipirona, Penicilina, Paracetamol"
          ></v-text-field>

          <v-text-field
            id="covenant"
            v-model="medicalInformations.covenant"
            label="Você tem algum convênio de saúde? Qual?"
            hint="Cite seu convênio"
          ></v-text-field>

          <v-radio-group
            id="hasBeenAssisted"
            v-model="medicalInformations.hasBeenAssisted"
            label="Já foi atendido pelo Barracão Digital antes?"
          >
            <v-radio label="Sim" :value="true"></v-radio>
            <v-radio label="Não" :value="false"></v-radio>
          </v-radio-group>

          <div class="mt-4">
            <v-btn @click.native="step = 1">Voltar</v-btn>
            <v-btn
              id="medicalInformationsBtn"
              color="primary"
              @click.native="step = 3"
            >
              Próximo
            </v-btn>
          </div>
        </form>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="step > 3">
        <span class="title">Contato</span>
        <span
          >É como um médico irá falar com você. Coloque somente contatos que
          você tem acesso imediato!</span
        >
      </v-stepper-step>
      <v-stepper-content step="3">
        <form @keydown.enter.prevent="validateContactSection">
          <v-text-field
            id="phone"
            v-model="$v.contact.phone.$model"
            v-mask="['(##) ####-####', '(##) #####-####']"
            :error-messages="phoneErrors"
            label="Telefone*"
            required
            autofocus
          ></v-text-field>

          <v-text-field
            id="email"
            v-model="contact.email"
            label="Email"
          ></v-text-field>

          <v-text-field
            id="whatsapp"
            v-model="contact.whatsapp"
            v-mask="['(##) ####-####', '(##) #####-####']"
            label="Whatsapp"
          ></v-text-field>

          <v-text-field
            id="telegram"
            v-model="contact.telegram"
            v-mask="['(##) ####-####', '(##) #####-####']"
            label="Telegram"
          ></v-text-field>

          <v-text-field
            id="hangout"
            v-model="contact.hangout"
            label="Hangouts"
          ></v-text-field>

          <v-text-field
            id="skype"
            v-model="contact.skype"
            label="Skype"
          ></v-text-field>

          <div class="mt-4">
            <v-btn @click.native="step = 2">Voltar</v-btn>
            <v-btn
              id="contactBtn"
              color="primary"
              :loading="isSaving"
              :disabled="isSaving"
              @click.native="validateContactSection"
            >
              Finalizar
            </v-btn>
          </div>
        </form>
      </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script>
import * as R from 'ramda'
import { required, integer, maxValue } from 'vuelidate/lib/validators'
import { zip, phone, cpf } from '~/utils/validations'
import unmaskText from '~/utils/unmaskText'

export default {
  data: () => ({
    step: 1,
    isSaving: false,
    isConsent: false,
    myData: {
      name: null,
      age: null,
      cpf: null,
      cep: null
    },
    medicalInformations: {
      meds: null,
      allergies: null,
      covenant: null,
      hasBeenAssisted: false
    },
    contact: {
      phone: null,
      email: null,
      whatsapp: null,
      telegram: null,
      hangout: null,
      skype: null
    }
  }),
  validations: {
    myData: {
      name: {
        required
      },
      age: {
        integer,
        required,
        maxValue: maxValue(125)
      },
      cpf: {
        required,
        cpf
      },
      cep: {
        required,
        zip
      }
    },
    contact: {
      phone: {
        required,
        phone
      }
    }
  },
  computed: {
    isConsentAccepted() {
      return this.$cookie.get('consent-accepted') || this.isConsent
    },
    nameErrors() {
      const errors = []
      if (!this.$v.myData.name.$dirty) return errors
      !this.$v.myData.name.required &&
        errors.push('Por favor, digite o seu nome.')
      return errors
    },
    ageErrors() {
      const errors = []
      if (!this.$v.myData.age.$dirty) return errors
      !this.$v.myData.age.integer &&
        errors.push('O formato do campo está incorreto.')
      !this.$v.myData.age.maxValue &&
        errors.push('Não é possível informar mais do que 125 anos.')
      !this.$v.myData.age.required &&
        errors.push('Por favor, digite a sua idade.')
      return errors
    },
    cpfErrors() {
      const errors = []
      if (!this.$v.myData.cpf.$dirty) return errors
      !this.$v.myData.cpf.required &&
        errors.push('Por favor, digite o seu cpf.')
      !this.$v.myData.cpf.cpf && errors.push('O formato do cpf está incorreto.')
      return errors
    },
    cepErrors() {
      const errors = []
      if (!this.$v.myData.cep.$dirty) return errors
      !this.$v.myData.cep.required &&
        errors.push('Por favor, digite o seu CEP.')
      !this.$v.myData.cep.zip && errors.push('O formato do cep está incorreto.')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.contact.phone.$dirty) return errors
      !this.$v.contact.phone.required &&
        errors.push('Por favor, digite o seu telefone.')
      !this.$v.contact.phone.phone &&
        errors.push('Por favor, digite o seu telefone.')
      return errors
    }
  },

  methods: {
    acceptConsent() {
      this.$cookie.set('consent-accepted', true, 360)
      this.isConsent = true
    },
    validateMyDataSection() {
      this.$v.myData.$touch()
      if (this.$v.myData.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.step = 2
    },
    validateContactSection() {
      this.$v.contact.$touch()
      if (this.$v.contact.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      const patient = {
        ...this.myData,
        cep: unmaskText(this.myData.cep),
        cpf: unmaskText(this.myData.cpf),
        ...this.medicalInformations,
        ...this.contact
      }

      this.isSaving = true

      this.$api.signUpPatient(patient).then(
        ({ ticket }) =>
          this.$router.push({
            name: 'patient-ticket',
            params: { ticket }
          }),
        (error) => {
          const message =
            R.path(['response', 'data', 'message'], error) || error
          this.$toast.error(message)
          this.isSaving = false
        }
      )
    }
  }
}
</script>