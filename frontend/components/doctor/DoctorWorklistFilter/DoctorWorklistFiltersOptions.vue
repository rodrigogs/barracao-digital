<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="600"
    max-width="600"
    left
  >
    <template v-slot:activator="{ on }">
      <v-badge
        color="green"
        :content="filtersApplied"
        title="Filtros aplicados"
      >
        <v-btn icon title="Filtros" v-on="on">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-badge>
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
            >
              <template v-slot:selection="data">
                <StatusBadge
                  :input-value="data.selected"
                  close
                  :status="data.item.value"
                  v-bind="data.attrs"
                  @click="data.select"
                  @close="removeStatusFromFilter(data.item)"
                />
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12">
            <v-subheader class="pl-0">Horas na fila</v-subheader>
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
import StatusBadge from '~/components/StatusBadge'
import patientStatusToText from '~/utils/patientStatusToText'
import { PATIENT_STATUS } from '~/constants'

const statuses = [
  {
    text: patientStatusToText(PATIENT_STATUS.WAITING).text,
    value: PATIENT_STATUS.WAITING
  },
  {
    text: patientStatusToText(PATIENT_STATUS.ONGOING).text,
    value: PATIENT_STATUS.ONGOING
  },
  {
    text: patientStatusToText(PATIENT_STATUS.WAITING_KIT).text,
    value: PATIENT_STATUS.WAITING_KIT
  },
  {
    text: patientStatusToText(PATIENT_STATUS.FINISHED).text,
    value: PATIENT_STATUS.FINISHED
  },
  {
    text: patientStatusToText(PATIENT_STATUS.GAVE_UP).text,
    value: PATIENT_STATUS.GAVE_UP
  },
  {
    text: patientStatusToText(PATIENT_STATUS.CANT_BE_ASSISTED).text,
    value: PATIENT_STATUS.CANT_BE_ASSISTED
  }
]

export default {
  name: 'DoctorWorklistFiltersOptions',
  components: {
    StatusBadge
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      filtersApplied: 0,
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
      this.filtersApplied = this.options.hoursWaiting > 0 ? 1 : 0
      if (this.options.statuses)
        this.filtersApplied += this.options.statuses.length
      this.$emit('input', { ...this.options })
    },
    removeStatusFromFilter(status) {
      const index = this.options.statuses.findIndex(
        ({ value }) => status.value === value
      )
      if (index >= 0) this.options.statuses.splice(index, 1)
    }
  }
}
</script>
