<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredPatients"
      sort-by="ticket"
      sort-desc
      multi-sort
      item-key="id"
      class="elevation-1 worklist"
      disable-pagination
      hide-default-footer
      @click:row="$emit('click', $event)"
    >
      <template v-slot:top>
        <DoctorWorklistFilter v-model="filter" />
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
        <v-chip outlined :color="`#${calculateColor(item)}`">
          {{ calculateTimeWaiting(item) }}
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        <StatusBadge :status="item.status" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { format } from 'date-fns'
import percentageToColor from '~/utils/percentageToColor'
import calculateTimeWaiting from '~/utils/calculateTimeWaiting'
import StatusBadge from '~/components/StatusBadge'
import DoctorWorklistFilter from '~/components/doctor/DoctorWorklistFilter/DoctorWorklistFilter'
import { PATIENT_STATUS } from '~/constants'

export default {
  name: 'DoctorWorklistTable',
  components: {
    StatusBadge,
    DoctorWorklistFilter
  },
  data() {
    return {
      filter: {
        search: '',
        options: {}
      },
      headers: [
        { text: 'Ticket', value: 'ticket', align: 'start' },
        { text: 'Nome', value: 'name', align: 'start', width: '60%' },
        { text: 'Tempo de espera', value: 'waitingTime', align: 'center' },
        { text: 'Status', value: 'status' }
      ],
      patientsSubscription: null,
      patients: []
    }
  },
  computed: {
    filteredPatients() {
      return this.patients.filter(({ name }) =>
        name.toLowerCase().includes((this.filter.search || '').toLowerCase())
      )
    }
  },
  watch: {
    'filter.options'() {
      this.updatePatientsQuerySubscription()
    }
  },
  methods: {
    async updatePatientsQuerySubscription() {
      if (this.patientsSubscription) await this.patientsSubscription()

      let query = this.$fireStore
        .collection('facilities')
        .doc(this.$auth.user.cep)
        .collection('patients')

      if (this.filter.options.statuses.length)
        query = query.where(
          'status',
          'in',
          this.filter.options.statuses.map(({ value }) => value)
        )
      if (this.filter.options.hoursWaiting) {
        const now = Date.now()
        const initialTime =
          now - this.filter.options.hoursWaiting * 60 * 60 * 1000
        query = query.where('createdAt', '>', initialTime)
      }

      return new Promise((resolve, reject) => {
        this.patients = []
        this.patientsSubscription = query.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const patient = change.doc.data()
            const index = this.patients.findIndex(
              ({ ticket }) => patient.ticket === ticket
            )
            if (change.type === 'added') {
              if (index !== -1) this.patients.splice(index, 1, patient)
              else this.patients.push(patient)
            }
            if (change.type === 'modified') {
              this.patients.splice(index, 1, patient)
            }
            if (change.type === 'removed') {
              this.patients.splice(index, 1)
            }
          })
          resolve()
        }, reject)
      })
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
    calculateColor(patient) {
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
    }
  }
}
</script>

<style>
.worklist table > tbody > tr {
  cursor: pointer;
}
</style>
