<template>
  <v-card>
    <DoctorStatus />
    <v-card-text>
      <div class="doctor-worklist-content">
        <DoctorFilters />
        <DoctorTable />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  DoctorStatus,
  DoctorFilters,
  DoctorTable,
} from '@/components/DoctorWorklist';

export default {
  components: {
    DoctorStatus,
    DoctorFilters,
    DoctorTable,
  },
};
</script>

<style scoped>
.doctor-worklist-content {
  margin-top: 8px;
}
</style>
