<template>
  <v-card>

    <v-card-title>
      O médico&nbsp;{{ patient.ongoingDoctorDoctorName }}&nbsp;está entrando em contato com você.
    </v-card-title>

    <v-card-subtitle>
      <h5>Siga as instruções abaixo:</h5>
    </v-card-subtitle>

    <v-card-text>
      <div v-html="patient.ongoingDoctorFeedback" v-linkified />
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import linkify from 'vue-linkify';

export default {
  name: 'PatientStatusOngoing',
  directives: {
    linkified: linkify,
  },
  computed: {
    ...mapGetters('patients', {
      patient: 'loggedInPatient',
    }),
  },
};
</script>
