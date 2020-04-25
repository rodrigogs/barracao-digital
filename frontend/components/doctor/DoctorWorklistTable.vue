<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="patients"
      :loading="isLoading"
      sort-by="createdAt"
      item-key="id"
      class="elevation-1 worklist"
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

          <v-btn icon :loading="isLoading" @click="refreshPatients">
            <v-badge
              :content="patientsChanges"
              :value="patientsChanges"
              color="green"
              overlap
            >
              <v-icon>mdi-table-refresh</v-icon>
            </v-badge>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.ticket="{ item }">
        <span class="subtitle-2">{{ item.ticket }}</span>
        <v-spacer />
        <small>{{ formatDate(item.createdAt) }}</small>
      </template>

      <template v-slot:item.name="{ item }">
        <span class="subtitle-2">{{ item.name }}</span>
        <v-spacer />
        <small>{{ item.age }} anos</small>
      </template>

      <template v-slot:item.waitingTime="{ item }">
        <v-chip outlined :color="`#${calulateColor(item)}`">
          {{ calculateTimeWaiting(item) }}
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        <StatusBadge :status="item.status" />
      </template>
    </v-data-table>

    <infinite-loading
      v-if="!isLoading"
      @infinite="handleNextPageRequest"
    ></infinite-loading>
  </div>
</template>

<script>
import { format } from 'date-fns'
import percentageToColor from '~/utils/percentageToColor'
import calculateTimeWaiting from '~/utils/calculateTimeWaiting'
import { PATIENT_STATUS } from '~/constants'
import StatusBadge from '~/components/StatusBadge'
import debounce from '~/utils/debounce'

export default {
  name: 'DoctorWorklistTable',
  components: {
    StatusBadge
  },
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
    status: null,
    timeWaiting: null,
    headers: [
      { text: 'Ticket', value: 'ticket', align: 'start' },
      { text: 'Nome', value: 'name', align: 'start', width: '60%' },
      { text: 'Tempo de espera', value: 'waitingTime', align: 'center' },
      { text: 'Status', value: 'status' }
    ],
    patientsSubscription: null,
    patientsChanges: 0
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
  mounted() {
    this.handlePatientsUpdate()
  },
  beforeDestroy() {
    if (this.patientsSubscription) this.patientsSubscription() // Unsubscribes
  },
  methods: {
    handlePatientsUpdate() {
      let isFisrtLoad = true
      this.patientsSubscription = this.$fireStore
        .collection('facilities')
        .doc(this.$auth.user.cep)
        .collection('patients')
        .onSnapshot((snapshot) => {
          // TODO update list dynamically
          if (isFisrtLoad) return (isFisrtLoad = false)
          snapshot.docChanges().forEach((change) => {
            // console.log(change.doc.data())
            this.patientsChanges += 1
          })
        })
    },
    handleNextPageRequest($loadingState) {
      return this.fetchNextPage().then(
        ({ lastEvaluatedKey }) => {
          if (lastEvaluatedKey) $loadingState.loaded()
          else $loadingState.complete()
        },
        () => $loadingState.complete()
      )
    },
    formatDate(timestamp) {
      return format(timestamp, 'dd/MM/y hh:mm')
    },
    calculateTimeWaiting(patient) {
      const ongoingStatus = patient[`${PATIENT_STATUS.ONGOING}Status`]

      if (ongoingStatus) {
        return calculateTimeWaiting(patient.createdAt, ongoingStatus.timestamp)
      }

      return calculateTimeWaiting(patient.createdAt, Date.now())
    },
    calulateColor(patient) {
      const finishedStatuses = [
        PATIENT_STATUS.FINISHED,
        PATIENT_STATUS.FACILITY_NOT_AVAILABLE,
        PATIENT_STATUS.GAVE_UP
      ]

      if (finishedStatuses.includes(patient.status)) {
        return 'black'
      }

      const now = Date.now()
      const timeWaiting = now - patient.createdAt
      const oneHour = 1000 * 60 * 60
      const percent = (oneHour / timeWaiting) * 100
      return percentageToColor(percent)
    },
    refreshPatients: debounce(function refresh() {
      this.patientsChanges = 0
      this.$emit('refresh')
    }, 1000)
  }
}
</script>

<style>
.worklist table > tbody > tr {
  cursor: pointer;
}
</style>
