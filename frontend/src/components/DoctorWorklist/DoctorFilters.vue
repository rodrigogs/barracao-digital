<template>
  <div class="doctor-filters-container">
    <div class="doctor-filters-title">Filtros</div>
    <div class="doctor-filters-fields">
      <!-- primeiro filtro: hora de entrada (ultimas 24h, ultimas 6h, todos)
        segundo filtro: status -->
      <div class="doctor-filters-field">
        <label class="doctor-filters-label" for="status">Hora de entrada</label>
        <select
          name="status"
          id="status"
          class="doctor-filters-select"
          v-model="timeWaiting"
          @change="onFilterUpdated"
        >
          <option value="86400000">Últimas 24h</option>
          <option value="21600000">Últimas 6h</option>
          <option value="">Todos</option>
        </select>
      </div>

      <div class="doctor-filters-field">
        <label class="doctor-filters-label" for="status">Status</label>
        <select
          name="status"
          id="status"
          class="doctor-filters-select"
          v-model="status"
          @change="onFilterUpdated"
        >
          <option value="waiting">Aguardando</option>
          <option value="ongoing">Em andamento</option>
          <option value="finished">Finalizado</option>
          <option value="waiting_kit">Aguardando kit</option>
          <option value="cant_be_assisted">Não pode ser atendido</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DoctorFilters',
  mounted() {
    this.onFilterUpdated();
  },
  data() {
    return {
      status: 'waiting',
      timeWaiting: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedUser']),
  },
  methods: {
    ...mapActions('worklist', ['updateFilter']),
    onFilterUpdated() {
      this.updateFilter({
        status: this.status,
        timeWaiting: this.timeWaiting,
      });
    },
  },
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
  width: 100%;
}

.doctor-filters-field {
  width: 100%;
}

.doctor-filters-select {
  width: 100%;
}
</style>
