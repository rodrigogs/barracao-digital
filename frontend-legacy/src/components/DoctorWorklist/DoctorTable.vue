<template>
  <div class="doctor-table-container">

    <v-data-table
      v-if="listPaginated && listPaginated.length > 0"
      :headers="headers"
      :items="listPaginated"
      :single-expand="true"
      :expanded.sync="tableExpanded"
      item-key="id"
      show-expand
      class="elevation-2"
      hide-default-footer
    >

      <template v-slot:item.createdAt="{ item }">
        <v-chip dark :style="{ 'background-color': `#${calulateColor(item.createdAt)}` }">
          {{ calcTimeWaiting(item.createdAt) }}
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        {{ getStatusMessage(item.status) }}
      </template>

      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length">
          <DoctorPatientSummary/>
        </td>
      </template>
    </v-data-table>

    <div class="doctor-table-pagination" v-if="listPaginated && listPaginated.length > 0">
      <button
        class="doctor-table-btn-pagination"
        :disabled="!previousPageAvailable"
        @click="previousPage"
      >
        <div>
          <span class="mdi mdi-chevron-left doctor-table-icon-pagination"></span>
        </div>
      </button>
      <div class="doctor-table-page-number">
        {{ pageNumber }}/{{ totalPages }}
      </div>
      <button
        class="doctor-table-btn-pagination"
        :disabled="!nextPageAvailable"
        @click="nextPage"
      >
        <div>
          <span class="mdi mdi-chevron-right doctor-table-icon-pagination"></span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Kairos from 'kairos';
import { mapState, mapActions, mapGetters } from 'vuex';
import DoctorPatientSummary from './DoctorPatientSummary.vue';

const perc2color = (perc) => {
  let r;
  const g = 0;
  let b;

  const normalizedPerc = (perc < 100) ? perc : 100;
  if (normalizedPerc < 50) {
    r = 255;
    b = Math.round(5.1 * normalizedPerc);
  } else {
    b = 255;
    r = Math.round(510 - 5.10 * normalizedPerc);
  }

  const h = r * 0x10000 + g * 0x100 + b * 0x1;
  return `#000000${h.toString(16)}`.slice(-6);
};

export default {
  name: 'DoctorTable',
  components: {
    DoctorPatientSummary,
  },
  data() {
    return {
      pageSize: 5,
      pageNumber: 1,
      headers: [
        { text: 'Nome', value: 'name' },
        { text: 'Idade', value: 'age' },
        { text: 'T.Esp.', value: 'createdAt' },
        { text: 'Status', value: 'status' },
      ],
      tableExpanded: [],
    };
  },
  computed: {
    ...mapState('worklist', {
      list: (state) => state.list,
      listPaginated(state) {
        const list = [...state.list].sort((a, b) => a.createdAt - b.createdAt);
        return list.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
      },
    }),
    ...mapGetters('worklist', {
      currentPatient: 'selectedPatient',
    }),
    selectedPatient: {
      get() {
        return this.currentPatient;
      },
      set(value = {}) {
        this.selectPatient({ ticket: value.ticket });
      },
    },
    nextPageAvailable() {
      return this.pageNumber < (this.list.length / this.pageSize);
    },
    previousPageAvailable() {
      return !(this.pageNumber === 1);
    },
    totalPages() {
      return Math.ceil(this.list.length / this.pageSize);
    },
  },
  methods: {
    ...mapActions('worklist', ['refreshList', 'selectPatient']),
    previousPage() {
      if (!this.previousPageAvailable) return;
      this.pageNumber -= 1;
    },
    nextPage() {
      if (!this.nextPageAvailable) return;
      this.pageNumber += 1;
    },
    paginate() {
      let registers = this.registers || [];
      registers = registers.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
      this.paginatedRegisters = [...registers];
    },
    calcTimeWaiting(createdAt) {
      const timeWaiting = Date.now() - createdAt;
      const time = Kairos.new(timeWaiting);
      return time.toString('hh:mm', true);
    },
    calulateColor(createdAt) {
      const now = Date.now();
      const timeWaiting = now - createdAt;
      const oneHour = 1000 * 60 * 60;
      const percent = (oneHour / timeWaiting) * 100;
      return perc2color(percent);
    },
    getStatusMessage(status = 'waiting') {
      if (status === 'waiting') return 'Aguardando';
      if (status === 'waiting_kit') return 'Aguardando kit';
      if (status === 'ongoing') return 'Em andamento';
      if (status === 'finished') return 'Finalizado';
      return 'Sem status';
    },
  },
  watch: {
    tableExpanded([newPatient]) {
      this.selectedPatient = newPatient;
    },
  },
};
</script>

<style scoped>
.doctor-table-loading {
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.doctor-table {
  border: 1px solid #CCCCCC;
  border-spacing: 0;
  border-radius: 2px;
  width: 100%;
  margin-top: 16px;
  text-align: left;
}

.doctor-table__head {
  font-size: 12px;
}

.doctor-table__head-tr {
  height: 40px;
  color: #505762;
  font-weight: bold;
  padding-left: 8px;
}

.doctor-table__th {
  text-align: center;
}

.doctor-table__th:first-of-type {
  text-align: left;
  padding-left: 8px;
}

.doctor-table__th:last-of-type {
  padding-right: 8px;
}

.doctor-table__body {
  font-size: 14px;
  color: #001F3F;
}

.doctor-table__tr {
  height: 40px;
}

.doctor-table__tr:nth-child(odd) {
  background: #F7F7F7;
}

.doctor-table__tr--active,
.doctor-table__tr--active:nth-child(odd) {
  color: #F7F7F7;
  background: #6C6EA0;
}

.doctor-table__td {
  text-align: center;
}

.doctor-table__td:first-of-type {
  text-align: left;
  padding-left: 8px;
}

.status-ongoing {
  color: #FBB13C;
}

.status-waiting-kit {
  color: #4CB944;
}

.doctor-table-pagination {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  margin-top: 16px;
}

.doctor-table-btn-pagination {
  color: #001F3F;
  background: #ffffff;
  height: 48px;
  width: 48px;
  font-weight: bold;
  border-radius: 4px;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}

.doctor-table-btn-pagination > div {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-action-active {
  color: var(--main-btn-color);
  background: #ffffff;
}

.doctor-table-icon-pagination {
  font-size: 24px;
}
</style>
