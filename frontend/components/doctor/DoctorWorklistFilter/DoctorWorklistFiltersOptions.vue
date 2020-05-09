<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="600"
    left
  >
    <template v-slot:activator="{ on }">
      <v-btn icon title="Filtros" v-on="on">
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="subheading">Filtros</v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="options.statuses"
              label="Status"
              :items="statuses"
              item-text="text"
              item-value="value"
              chips
              clearable
              multiple
            ></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-subheader class="pl-0">Horas aguardando</v-subheader>
            <v-slider
              v-model="options.hoursWaiting"
              thumb-label="always"
              min="1"
              max="24"
            ></v-slider>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text color="error" @click="menu = false">Cancelar</v-btn>
        <v-btn text color="primary" @click="update">
          Aplicar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { PATIENT_STATUS } from '~/constants'

const statuses = [
  {
    text: 'Aguardando',
    value: PATIENT_STATUS.WAITING
  },
  // {
  //   text: 'Aguardando kit',
  //   value: PATIENT_STATUS.WAITING_KIT
  // },
  {
    text: 'Em andamento',
    value: PATIENT_STATUS.ONGOING
  },
  {
    text: 'Finalizado',
    value: PATIENT_STATUS.FINISHED
  }
]

export default {
  name: 'DoctorWorklistFiltersOptions',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      options: {
        statuses: this.value.statuses || [],
        hoursWaiting: this.value.hoursWaiting || 24
      }
    }
  },
  computed: {
    statuses() {
      return statuses
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.menu = false
      this.$emit('input', { ...this.options })
    }
  }
}
</script>
