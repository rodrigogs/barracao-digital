<template>
  <div>
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
};
</script>

<style scoped>
.doctor-worklist-content {
  margin-top: 8px;
}
</style>
