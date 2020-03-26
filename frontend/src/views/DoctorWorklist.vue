<template>
  <div class="doctor-worklist-container">
    <DoctorStatus />
    <div class="doctor-worklist-content">
      <DoctorFilters />
      <DoctorTable />
      <DoctorPatientSummary v-bind:patient="patient" />
    </div>
  </div>
</template>

<script>
import {
  DoctorStatus,
  DoctorFilters,
  DoctorTable,
  DoctorPatientSummary,
} from '@/components/DoctorWorklist';

export default {
  components: {
    DoctorStatus,
    DoctorFilters,
    DoctorTable,
    DoctorPatientSummary,
  },
  data() {
    return {
      patient: null,
    };
  },
  methods: {
    mock() {
      this.patient = {
        name: 'Neri Fontana',
        age: '26',
        cep: '984519',
        meds: 'Sim',
        allergies: 'Não',
        covenant: 'UNIMED',
        hasBeenAssisted: false,
        phone: '489961235478',
        email: 'email@email.com',
        whatsapp: '489961235478',
        telegram: '489961235478',
        hangout: 'test',
        skype: 'test',
        ticket: '5641',
        status: 'ongoing',
      };
    },
  },
};
</script>

<style scoped>
.doctor-worklist-container {
}

.doctor-worklist-content {
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 6px;
}

.content {

}
</style>
