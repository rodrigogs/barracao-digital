<template>
  <div class="doctor-worklist-container">
    <DoctorStatus />
    <div class="doctor-worklist-content">
      <DoctorFilters />
      <DoctorTable />
      <DoctorPatientSummary />
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
