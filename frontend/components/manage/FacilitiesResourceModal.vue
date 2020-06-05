<template>
  <v-dialog :value="facility" max-width="800" @click:outside="$emit('close')">
    <v-card>
      <v-card-title v-if="isCreating" class="headline align-start">
        Criar nova instalação
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-title v-else class="headline align-start">
        #{{ facility.origin }}
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <form>
          <v-text-field
            v-if="isCreating"
            id="origin"
            v-model="$v.form.origin.$model"
            v-mask="'#####-###'"
            :error-messages="originErrors"
            label="CEP de origem*"
            required
            autofocus
          />

          <v-text-field
            id="name"
            v-model="$v.form.name.$model"
            :error-messages="nameErrors"
            label="Nome da instalação*"
            required
          />

          <v-text-field
            id="techDirector"
            v-model="$v.form.techDirector.$model"
            :error-messages="techDirectorErrors"
            label="Diretor técnico*"
            required
          />

          <v-text-field
            id="contact"
            v-model="$v.form.contact.$model"
            :error-messages="contactErrors"
            label="Contato*"
            required
          />

          <v-combobox
            v-if="!insertZipsInBulk"
            v-model="$v.form.destinations.$model"
            :error-messages="destinationsErrors"
            :disabled="isLoadingDestinations"
            :loading="isLoadingDestinations"
            label="CEP's de destino"
            multiple
            small-chips
            deletable-chips
            clearable
            :hide-no-data="!currentDestination"
            :search-input.sync="currentDestination"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-chip
                  :color="
                    isValidZipCode(currentDestination) ? 'primary' : 'error'
                  "
                  label
                  small
                >
                  {{ currentDestination }}
                </v-chip>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                label
                small
                :color="isValidZipCode(item) ? 'primary' : 'error'"
              >
                <span class="pr-2">
                  {{ item }}
                </span>
                <v-icon small @click="parent.selectItem(item)">
                  mdi-close
                </v-icon>
              </v-chip>
            </template>
          </v-combobox>

          <v-textarea
            v-else
            v-model="zipsBulk"
            label="Insira apenas os números dos CEPs separados por vírgula"
          ></v-textarea>

          <v-checkbox
            v-model="insertZipsInBulk"
            label="Inserir em massa"
          ></v-checkbox>
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
    isCreating: false,
    isLoading: false,
    isLoadingDestinations: false,
    destinations: [],
    currentDestination: null,
    insertZipsInBulk: false,
    zipsBulk: '',
    form: {
      origin: null,
      name: null,
      techDirector: null,
      contact: null,
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
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required &&
        errors.push('Por favor, digite o nome da instalação.')
      return errors
    },
    techDirectorErrors() {
      const errors = []
      if (!this.$v.form.techDirector.$dirty) return errors
      !this.$v.form.techDirector.required &&
        errors.push(
          'Por favor, digite o nome do diretor técnico da instalação.'
        )
      return errors
    },
    contactErrors() {
      const errors = []
      if (!this.$v.form.contact.$dirty) return errors
      !this.$v.form.contact.required &&
        errors.push('Por favor, digite o contato da instalação.')
      return errors
    },
    destinationsErrors() {
      const errors = []
      if (!this.$v.form.destinations.$dirty) return errors
      !this.$v.form.destinations.onlyNumbers &&
        errors.push('Por favor, digite apenas números.')
      !this.$v.form.destinations.validZips &&
        errors.push('Um ou mais CPFs digitados são inválidos.')
      return errors
    }
  },
  watch: {
    insertZipsInBulk(trueOrFalse) {
      if (trueOrFalse) this.zipsBulk = this.form.destinations.join(',')
    }
  },
  mounted() {
    this.isLoadingDestinations = true
    this.$api
      .getAllDestinationsByOrigin(this.facility.origin)
      .then(
        (destinations) => {
          this.destinations = destinations
          this.form.destinations = this.destinations
        },
        () => {
          this.destinations = []
        }
      )
      .finally(() => {
        this.isLoadingDestinations = false
      })

    if (!this.facility.origin) this.isCreating = true
    this.form.origin = this.facility.origin
    this.form.name = this.facility.name
    this.form.techDirector = this.facility.techDirector
    this.form.contact = this.facility.contact
  },
  validations: {
    form: {
      origin: {
        required,
        zip
      },
      name: {
        required
      },
      techDirector: {
        required
      },
      contact: {
        required
      },
      destinations: {
        onlyNumbers: (values) => {
          return !values.some((v) => isNaN(v))
        },
        validZips: (values) => {
          return values.every(zip)
        }
      }
    }
  },
  methods: {
    edit() {
      return true
    },

    isValidZipCode(code) {
      return zip(code)
    },

    validateAndSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return this.$noty.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true

      const destinations = this.insertZipsInBulk
        ? this.zipsBulk.split(',').map((zip) => unmaskText(zip.trim()))
        : this.form.destinations

      const addingDestinations = destinations.filter(
        (destination) => !this.destinations.includes(destination)
      )

      const removingDestinations = this.destinations.filter(
        (destination) => !destinations.includes(destination)
      )

      const facility = {
        ...this.form,
        origin: unmaskText(this.form.origin),
        destinations: []
      }

      return this.submit(
        this.isCreating,
        facility,
        addingDestinations,
        removingDestinations
      )
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
