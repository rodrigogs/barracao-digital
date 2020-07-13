<template>
  <v-container fluid>
    <v-card v-if="$auth.loggedIn" elevation="0" append>
      <DoctorStatus
        :active="$auth.user.active"
        :username="$auth.user.username"
        :facility-cep="$auth.user.cep"
        :start-service="toggleStatus"
        :stop-service="toggleStatus"
      />
      <DoctorWorklistTable @click="patientSelected" />
      <nuxt-child />
    </v-card>
  </v-container>
</template>

<script>
import DoctorStatus from '@/components/doctor/DoctorStatus'
import DoctorWorklistTable from '@/components/doctor/DoctorWorklistTable'

export default {
  name: 'PagesDoctor',
  middleware: 'auth',
  components: {
    DoctorStatus,
    DoctorWorklistTable
  },
  data: () => ({
    showTeamStatus: false,
    doctorSubscription: null,
    patientsSubscription: null,
    togglingStatus: false,
    patients: []
  }),
  methods: {
    toggleStatus() {
      this.togglingStatus = true
      return this.$api
        .alternateDoctorStatus()
        .catch(() =>
          this.$noty.error(
            'Não foi possivel alterar o status de atendimento, tente novamente mais tarde.'
          )
        )
        .finally(() => (this.togglingStatus = false))
    },
    patientSelected(patient) {
      this.$router.push({
        name: 'doctor-ticket',
        params: { ticket: patient.ticket }
      })
    }
  }
}
</script>
