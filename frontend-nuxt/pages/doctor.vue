<template>
  <v-container fluid>
    <v-card elevation="0" append>
      <DoctorStatus
        :active="$auth.user.active"
        :username="$auth.user.username"
        :start-service="toggleStatus"
        :stop-service="toggleStatus"
        @signOut="signOut"
      />
      <DoctorWorklistTable
        :patients="patients"
        :is-loading="$fetchState.pending"
        :fetch-next-page="fetchNextPatientPage"
        @status="statusChanged"
        @timeWaiting="timeWaitingChanged"
        @click="patientSelected"
      />
      <nuxt-child />
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import DoctorStatus from '@/components/doctor/DoctorStatus'
import DoctorWorklistTable from '@/components/doctor/DoctorWorklistTable'

const ONE_MINUTE = 60000

export default {
  middleware: 'auth',
  components: {
    DoctorStatus,
    DoctorWorklistTable
  },
  fetch() {
    return this.$store.dispatch('worklist/fetchPatients', {
      filters: this.$route.query
    })
  },
  data: () => ({
    selectedPatient: null
  }),
  computed: {
    ...mapState('worklist', {
      patients: 'patients',
      filters: 'filters'
    })
  },
  activated() {
    this.$router.push({ query: this.filters })

    // Call fetch again if last fetch more than 60 sec ago
    if (this.$fetchState.timestamp <= Date.now() - ONE_MINUTE) {
      this.$fetch()
    }
  },
  methods: {
    toggleStatus() {
      return this.$api.alternateDoctorStatus().then(
        (user) => this.$auth.setUser(user),
        () =>
          this.$toast.error(
            'Não foi possivel alterar o status de atendimento, tente novamente mais tarde.'
          )
      )
    },
    statusChanged(status) {
      this._setQueryParamsAndFetch({ status })
    },
    timeWaitingChanged(timeWaiting) {
      this._setQueryParamsAndFetch({ timeWaiting })
    },
    patientSelected(patient) {
      this.$store.commit('worklist/setPatient', patient)
      this.$router.push({
        name: 'doctor-ticket',
        params: { ticket: patient.ticket }
      })
    },
    fetchNextPatientPage() {
      return this.$store.dispatch('worklist/fetchNextPatientsPage')
    },
    signOut() {
      this.$destroy() // we must manually destroy the screen because of keep-alive
      this.$auth.logout()
    },
    async _setQueryParamsAndFetch(filters = {}) {
      await new Promise((resolve, reject) =>
        this.$router.push(
          {
            query: { ...this.$route.query, ...filters }
          },
          resolve,
          reject
        )
      )
      return this.$fetch()
    }
  }
}
</script>
