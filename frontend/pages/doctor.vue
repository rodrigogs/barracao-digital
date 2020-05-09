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
    timeoutAfterInactiveModalDisplayed: null,
    idle: null,
    doctorSubscription: null,
    patientsSubscription: null,
    togglingStatus: false,
    patients: []
  }),
  beforeDestroy() {
    this.idle && this.idle.stop()
  },
  methods: {
    toggleStatus() {
      this.togglingStatus = true
      return this.$api
        .alternateDoctorStatus()
        .catch(() =>
          this.$toast.error(
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
