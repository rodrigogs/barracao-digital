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
  asyncData({ app, store, params, error }) {
    const storePatient = store.getters['worklist/getPatient'](params.ticket)
    if (storePatient) return Promise.resolve({ patient: storePatient })

    return store.dispatch('worklist/fetchPatient', params.ticket).then(
      (patient) => ({ patient }),
      () => error({ message: 'Usuário Inexistente', statusCode: 404 })
    )
  },
  methods: {
    savePatient({ status, form, next }) {
      return this.$store
        .dispatch('worklist/savePatientStatus', {
          ticket: this.patient.ticket,
          status,
          form
        })
        .then(
          (patient) => {
            this.$toast.success('Status do paciente alterado com sucesso.')
            this.patient = patient
          },
          (error) => {
            this.$toast.error(
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
