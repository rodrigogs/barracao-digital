<template>
  <section class="section">
    <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
      O médico <strong>{{ patient.ongoingDoctorDoctorName }}</strong> está entrando em contato com você.
      <br>
      Siga as instruções abaixo:
      <br>
      <br>
      <v-textarea id="doctor-ongoing-feedback" cols="50" rows="3" v-model="patient.ongoingDoctorFeedback" readonly></v-textarea>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PatientStatusOngoing',
  computed: {
    ...mapGetters('patients', {
      patient: 'loggedInPatient',
    }),
  },
};
</script>
