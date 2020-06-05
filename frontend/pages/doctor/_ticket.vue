<template>
  <DoctorPatientStatusModal
    :patient="patient"
    :save="savePatient"
    @close="modalClosed"
  />
</template>

<script>
import DoctorPatientStatusModal from '@/components/doctor/DoctorPatientStatusModal'

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  components: {
    DoctorPatientStatusModal
  },
  asyncData({ app, params, error }) {
    return app.$api.searchPatientByTicket(params.ticket).then(
      (patient) => ({ patient }),
      () => error({ message: 'Usuário Inexistente', statusCode: 404 })
    )
  },
  data: () => ({
    patientSubscription: null
  }),
  mounted() {
    this.patientSubscription = this.$fireStore
      .collection('facilities')
      .doc(this.patient.originCep)
      .collection('patients')
      .doc(this.patient.ticket)
      .onSnapshot((doc) => {
        this.patient = doc.data()
      })
  },
  beforeDestroy() {
    this.patientSubscription && this.patientSubscription()
  },
  methods: {
    savePatient({ status, form }) {
      return this.$api
        .setPatientStatus(this.patient.ticket, {
          status,
          form
        })
        .then(
          (patient) => {
            this.$noty.success('Status do paciente alterado com sucesso.')
            this.patient = patient
          },
          (error) => {
            this.$noty.error(
              'Não foi possível alterar o status do paciente, tente novamente mais tarde.'
            )
            return Promise.reject(error)
          }
        )
    },
    modalClosed() {
      this.$router.push({ name: 'doctor' })
    }
  }
}
</script>
