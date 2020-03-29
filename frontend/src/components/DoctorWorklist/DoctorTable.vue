<template>
  <div class="doctor-table-container">
    <div class="doctor-table-loading" v-if="!listPaginated || listPaginated.length === 0">.
      Nenhum registro filtrado ainda
    </div>
    <table class="doctor-table" v-if="listPaginated && listPaginated.length > 0">
      <thead class="doctor-table__head">
        <tr class="doctor-table__head-tr">
          <th class="doctor-table__th doctor-table__th--name">Nome</th>
          <th class="doctor-table__th doctor-table__th--age">Idade</th>
          <th class="doctor-table__th doctor-table__th--waitTime">T.Esp.</th>
          <th class="doctor-table__th doctor-table__th--status">Status</th>
        </tr>
      </thead>
      <tbody class="doctor-table__body">
        <tr
          class="doctor-table__tr"
          v-for="item in listPaginated"
          v-bind:key="item.id"
          :class="{ 'doctor-table__tr--active': selectedPatient.ticket === item.ticket }"
          @click="selectPatient({ ticket: item.ticket })"
        >
          <td class="doctor-table__td">{{ item.name }}</td>
          <td class="doctor-table__td">{{ item.age }}</td>
          <td class="doctor-table__td">{{ calcTimeWaiting(item.createdAt) }}</td>
          <td class="doctor-table__td" :class="{
            'status-ongoing': item.status === 'ongoing',
            'status-waiting-kit': item.status === 'waiting_kit',
          }">{{ getStatusMessage(item.status) }}</td>
        </tr>
      </tbody>
    </table>
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

export default {
  name: 'DoctorTable',
  data() {
    return {
      pageSize: 5,
      pageNumber: 1,
    };
  },
  computed: {
    ...mapState('worklist', {
      list: (state) => state.list,
      listPaginated(state) {
        const list = state.list || [];
        return list.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
      },
      selectedPatient: (state) => state.selectedPatient,
    }),
    ...mapGetters('worklist', ['selectedPatient']),
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
      return time.toString('hh:mm');
    },
    getStatusMessage(status = 'waiting') {
      if (status === 'waiting') return 'Aguardando';
      if (status === 'waiting_kit') return 'Aguardando kit';
      if (status === 'ongoing') return 'Em andamento';
      if (status === 'finished') return 'Finalizado';
      return 'Sem status';
    },
  },
  created() {
    this.refreshList();
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
