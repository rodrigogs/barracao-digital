<template>
  <div class="doctor-filters-container">
    <div class="doctor-filters-title">Filtros</div>
    <div class="doctor-filters-fields">
      <div class="doctor-filters-field">
        <label class="doctor-filters-label" for="status">Status</label>
        <select
          name="status"
          id="status"
          class="doctor-filters-select"
        ></select>
      </div>

      <div class="doctor-filters-field">
        <label class="doctor-filters-label" for="status">Status</label>
        <select
          name="status"
          id="status"
          class="doctor-filters-select"
        ></select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorFilters',
};
</script>

<style scoped>
.doctor-filters-title {
  color: #505762;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 5px;
}

.doctor-filters-fields {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.doctor-filters-field {
  width: 100%;
}

.doctor-filters-select {
  width: 100%;
}
</style>
