<template>
  <v-container fluid>
    <v-scroll-y-transition mode="out-in">
      <v-alert v-if="timeoutAfterInactiveModalDisplayed" type="info">
        Você está inativo a um tempo, iremos parar o seu atendimento se não
        houver nenhuma atividade em 1 minuto
      </v-alert>
    </v-scroll-y-transition>

    <v-card v-if="$auth.loggedIn" elevation="0" append>
      <DoctorStatus
        :active="$auth.user.active"
        :username="$auth.user.username"
        :facility-cep="$auth.user.cep"
        :start-service="toggleStatus"
        :stop-service="toggleStatus"
        @refresh="$fetch()"
      />
      <DoctorWorklistTable
        :patients="patients"
        :is-loading="$fetchState.pending"
        :fetch-next-page="fetchNextPatientPage"
        :patients-changes="patientsChanges"
        @status="statusChanged"
        @timeWaiting="timeWaitingChanged"
        @refresh="$fetch()"
        @click="patientSelected"
      />
      <nuxt-child />
    </v-card>
  </v-container>
</template>

<script>
import IdleJs from 'idle-js'
import { mapState } from 'vuex'
import DoctorStatus from '@/components/doctor/DoctorStatus'
import DoctorWorklistTable from '@/components/doctor/DoctorWorklistTable'
import debounce from '@/utils/debounce'

const ONE_MINUTE = 60000
const THIRTY_MINUTES = ONE_MINUTE * 30

export default {
  name: 'PagesDoctor',
  middleware: 'auth',
  components: {
    DoctorStatus,
    DoctorWorklistTable
  },
  fetch() {
    if (this.fetching) return
    this.fetching = true
    this.patientsChanges = 0
    return this.$store
      .dispatch('worklist/fetchPatients', {
        filters: this.$route.query
      })
      .finally(() => {
        this.fetching = false
        this.fetchWhenChangesDetected = false
      })
  },
  data: () => ({
    showTeamStatus: false,
    timeoutAfterInactiveModalDisplayed: null,
    idle: null,
    doctorSubscription: null,
    patientsSubscription: null,
    patientsChanges: 0,
    fetching: false,
    togglingStatus: false,
    fetchWhenChangesDetected: false
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
  mounted() {
    this.idle = new IdleJs({
      idle: THIRTY_MINUTES,
      onIdle: () => {
        if (!this.$auth.user.active) return

        this.timeoutAfterInactiveModalDisplayed = setTimeout(() => {
          this.toggleStatus()
          this.timeoutAfterInactiveModalDisplayed = null
        }, ONE_MINUTE)
      },
      onActive: () => {
        if (this.timeoutAfterInactiveModalDisplayed)
          clearTimeout(this.timeoutAfterInactiveModalDisplayed)
        this.timeoutAfterInactiveModalDisplayed = null
      }
    }).start()

    this.doctorSubscription = this.$fireStore
      .collection('facilities')
      .doc(this.$auth.user.cep)
      .collection('doctors')
      .doc(this.$auth.user.username)
      .onSnapshot((doc) => {
        const updatedDoctor = doc.data()
        if (
          this.$auth.user.active !== updatedDoctor.active &&
          !this.togglingStatus
        ) {
          this.fetchWhenChangesDetected = true
        }
        this.$auth.setUser(updatedDoctor)
      })

    let isFirstLoad = true
    this.patientsSubscription = this.$fireStore
      .collection('facilities')
      .doc(this.$auth.user.cep)
      .collection('patients')
      .onSnapshot((snapshot) => {
        // TODO update list dynamically
        if (isFirstLoad) return (isFirstLoad = false)
        snapshot.docChanges().forEach((change) => {
          // console.log(change.doc.data())
          if (this.fetchWhenChangesDetected) this.debouncedFetch()
          this.patientsChanges += 1
        })
      })
  },
  beforeDestroy() {
    this.idle && this.idle.stop()
    this.doctorSubscription && this.doctorSubscription()
    this.patientsSubscription && this.patientsSubscription()
  },
  methods: {
    debouncedFetch: debounce(function() {
      this.$fetch()
    }, 500),
    toggleStatus() {
      this.togglingStatus = true
      return this.$api
        .alternateDoctorStatus()
        .then(() => this.$fetch())
        .catch(() =>
          this.$toast.error(
            'Não foi possivel alterar o status de atendimento, tente novamente mais tarde.'
          )
        )
        .finally(() => (this.togglingStatus = false))
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
      if (!this.$store.state.worklist.lastEvaluatedKey)
        return Promise.resolve({ lastEvaluatedKey: null })
      return this.$store.dispatch('worklist/fetchNextPatientsPage')
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
