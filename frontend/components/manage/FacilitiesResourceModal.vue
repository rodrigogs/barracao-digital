<template>
  <v-dialog :value="facility" max-width="800" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="headline align-start">
        #{{ facility.origin }}
      </v-card-title>

      <v-card-text>
        <form @keydown.enter.prevent="validateAndSubmit">
          <v-text-field
            id="origin"
            v-model="$v.form.origin.$model"
            v-mask="'#####-###'"
            :error-messages="originErrors"
            label="CEP de origem*"
            required
            autofocus
          />

          <v-text-field
            id="contact"
            v-model="$v.form.contact.$model"
            :error-messages="contactErrors"
            label="Contato*"
            required
          />

          <v-text-field
            id="contactType"
            v-model="$v.form.contactType.$model"
            :error-messages="contactTypeErrors"
            label="Tipo do contato*"
            required
          />

          <v-combobox
            v-model="form.destinations"
            label="CEP's de destino"
            multiple
            small-chips
            deletable-chips
          ></v-combobox>
        </form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          class="mt-4"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="validateAndSubmit"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { zip } from '~/utils/validations'
import unmaskText from '~/utils/unmaskText'

export default {
  name: 'FacilitiesResourceModal',
  props: {
    facility: {
      type: Object,
      required: true
    },
    submit: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    form: {
      origin: null,
      contact: null,
      contactType: null,
      destinations: null
    }
  }),
  computed: {
    originErrors() {
      const errors = []
      if (!this.$v.form.origin.$dirty) return errors
      !this.$v.form.origin.required &&
        errors.push('Por favor, digite o seu CEP.')
      !this.$v.form.origin.zip &&
        errors.push('O formato do cep está incorreto.')
      return errors
    },
    contactErrors() {
      const errors = []
      if (!this.$v.form.contact.$dirty) return errors
      !this.$v.form.contact.required &&
        errors.push('Por favor, digite o seu contato.')
      return errors
    },
    contactTypeErrors() {
      const errors = []
      if (!this.$v.form.contactType.$dirty) return errors
      !this.$v.form.contactType.required &&
        errors.push('Por favor, digite o tipo do seu contato.')
      return errors
    }
  },
  mounted() {
    this.form.origin = this.facility.origin
    this.form.contact = this.facility.contact
    this.form.contactType = this.facility.contactType
    this.form.destinations = [...this.facility.destination]
  },
  validations: {
    form: {
      origin: {
        required,
        zip
      },
      contact: {
        required
      },
      contactType: {
        required
      }
    }
  },
  methods: {
    validateAndSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      const facility = {
        ...this.form,
        origin: unmaskText(this.form.origin)
      }

      this.submit(facility)
    }
  }
}
</script>
