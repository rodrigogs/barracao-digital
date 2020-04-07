<template>
  <div class="doctor-filters-container">
    <div class="doctor-filters-title">Filtros</div>
    <v-row>
      <v-col cols="5">
        <v-select
          name="timeWaiting"
          id="timeWaiting"
          v-model="timeWaiting"
          @change="onFilterUpdated"
          :items="timeFilterItems"
          label="Hora de entrada"
        ></v-select>
      </v-col>
      <v-col md="6" sm="5">
        <v-select
          name="status"
          id="status"
          v-model="status"
          @change="onFilterUpdated"
          :items="statusFilterItems"
          label="Status"
        ></v-select>
      </v-col>
      <v-col>
        <v-btn
          icon
          color="primary"
          @click="onClickedRefreshButton"
          :loading="loadingPatients"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
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
      timeFilterItems: [
        {
          text: 'Últimas 24',
          value: '86400000',
        },
        {
          text: 'Últimas 6h',
          value: '21600000',
        },
        {
          text: 'Todos',
          value: '',
        },
      ],
      statusFilterItems: [
        {
          text: 'Aguardando',
          value: 'waiting',
        },
        {
          text: 'Em andamento',
          value: 'ongoing',
        },
        {
          text: 'Finalizado',
          value: 'finished',
        },
        {
          text: 'Aguardando kit',
          value: 'waiting_kit',
        },
        {
          text: 'Não pode ser atendido',
          value: 'cant_be_assisted',
        },
      ],
      loadingPatients: false,
      lastTimeUpdated: 0,
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedUser']),
  },
  methods: {
    ...mapActions('worklist', ['updateFilter']),
    onClickedRefreshButton() {
      const oneMinute = 1000 * 60;
      const timeElapsedSinceLastRefresh = Date.now() - this.lastTimeUpdated;
      const timeLeftToTheNextRefresh = oneMinute - timeElapsedSinceLastRefresh;
      if (timeElapsedSinceLastRefresh < oneMinute) {
        return this.$noty.info(`Aguarde ${Math.ceil(timeLeftToTheNextRefresh / 1000)} segundos`);
      }
      return this.onFilterUpdated();
    },
    async onFilterUpdated() {
      try {
        this.loadingPatients = true;
        await this.updateFilter({
          status: this.status,
          timeWaiting: this.timeWaiting,
        });
        this.lastTimeUpdated = Date.now();
      } catch (err) {
        console.error('Error updating filter:', err);
      } finally {
        this.loadingPatients = false;
      }
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
