<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="patients"
      :loading="isLoading"
      sort-by="createdAt"
      item-key="id"
      class="elevation-1"
      disable-filtering
      disable-pagination
      disable-sort
      hide-default-footer
      @click:row="$emit('click', $event)"
    >
      <template v-slot:top>
        <v-toolbar elevation="1">
          <v-toolbar-items>
            <v-row>
              <v-col>
                <v-select
                  v-model="timeWaiting"
                  :items="timeWaitingFilters"
                  label="Hora de entrada"
                  dense
                  clearable
                  @change="$emit('timeWaiting', $event)"
                />
              </v-col>

              <v-col>
                <v-select
                  v-model="status"
                  :items="statusFilters"
                  label="Status"
                  dense
                  clearable
                  @change="$emit('status', $event)"
                />
              </v-col>
            </v-row>
          </v-toolbar-items>

          <v-spacer />

          <v-btn icon @click="refreshPatients">
            <v-icon>mdi-table-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.name="{ item }">
        <span class="subtitle-2">{{ item.name }}</span>
        <v-spacer />
        <small>{{ item.age }} anos</small>
      </template>

      <template v-slot:item.createdAt="{ item }">
        <v-chip outlined :color="`#${calulateColor(item.createdAt)}`">
          {{ calculateTimeWaiting(item.createdAt) }}
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip outlined>
          {{ getStatusMessage(item.status) }}
        </v-chip>
      </template>
    </v-data-table>

    <mugen-scroll
      v-if="!isPaginationFinished"
      :handler="handleNextPageRequest"
      :should-handle="!isLoadingNextPage && !isLoading"
    >
      <div class="block text-center mt-4">
        <v-progress-circular
          :size="30"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </mugen-scroll>
  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import percentageToColor from '~/utils/percentageToColor'
import calculateTimeWaiting from '~/utils/calculateTimeWaiting'
import patientStatusToText from '~/utils/patientStatusToText'
import { PATIENT_STATUS } from '~/constants'

export default {
  name: 'DoctorWorklistTable',
  components: { MugenScroll },
  props: {
    patients: {
      type: Array,
      required: true,
      deafult: () => []
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    fetchNextPage: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    isLoadingNextPage: false,
    isPaginationFinished: false,
    status: null,
    timeWaiting: null,
    headers: [
      { text: 'Ticket', value: 'ticket', align: 'start' },
      { text: 'Nome', value: 'name', align: 'start', width: '60%' },
      { text: 'Tempo de espera', value: 'createdAt', align: 'center' },
      { text: 'Status', value: 'status' }
    ]
  }),
  computed: {
    statusFilters() {
      return [
        {
          text: 'Aguardando',
          value: PATIENT_STATUS.WAITING
        },
        {
          text: 'Aguardando kit',
          value: PATIENT_STATUS.WAITING_KIT
        },
        {
          text: 'Em andamento',
          value: PATIENT_STATUS.ONGOING
        },
        {
          text: 'Finalizado',
          value: PATIENT_STATUS.FINISHED
        }
      ]
    },
    timeWaitingFilters() {
      return [
        {
          text: 'Últimas 24h',
          value: 86400000
        },
        {
          text: 'Últimas 6h',
          value: 21600000
        }
      ]
    }
  },
  activated() {
    const { status, timeWaiting } = this.$route.query
    if (status) this.status = status
    if (timeWaiting && !Number.isNaN(timeWaiting))
      this.timeWaiting = Number(timeWaiting)
  },
  methods: {
    handleNextPageRequest() {
      this.isLoadingNextPage = true
      this.fetchNextPage()
        .then(({ lastEvaluatedKey }) => {
          if (!lastEvaluatedKey) this.isPaginationFinished = true
        })
        .finally(() => {
          this.isLoadingNextPage = false
        })
    },
    calculateTimeWaiting(createdAt) {
      return calculateTimeWaiting(createdAt)
    },
    calulateColor(createdAt) {
      const now = Date.now()
      const timeWaiting = now - createdAt
      const oneHour = 1000 * 60 * 60
      const percent = (oneHour / timeWaiting) * 100
      return percentageToColor(percent)
    },
    getStatusMessage(status = PATIENT_STATUS.WAITING) {
      return patientStatusToText(status).text
    },
    refreshPatients() {
      this.isPaginationFinished = false
      this.$emit('refresh')
    }
  }
}
</script>
