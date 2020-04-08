<template>
  <section class="section">
    <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
      {{ patient.name }}, nossa equipe está sobrecarregada no momento.
    </div>

    <div class="patient-enqueued__text">
      Tente novamente mais tarde.
    </div>
  </section>
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
