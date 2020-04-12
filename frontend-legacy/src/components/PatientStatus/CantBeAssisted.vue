<template>
  <v-card>

    <v-card-title>
      {{ patient.name }}, nossa equipe está sobrecarregada no momento.
    </v-card-title>

    <v-card-subtitle>
      <h5>Siga as instruções abaixo:</h5>
    </v-card-subtitle>

    <v-card-text>
      Tente novamente mais tarde.
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PatientStatusCantBeAssisted',
  computed: {
    ...mapGetters('patients', {
      patient: 'loggedInPatient',
    }),
  },
};
</script>
