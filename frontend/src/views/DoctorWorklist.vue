<template>
  <div class="container">
    <DoctorStatus />
    <div class="content">
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
.container {
}

.status-container {
}

.content {

}
</style>
