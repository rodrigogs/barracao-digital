<template>
  <div class="doctor-table-container">
    <table class="doctor-table">
      <thead class="doctor-table__head">
        <tr class="doctor-table__head-tr">
          <th class="doctor-table__th doctor-table__th--name">Nome</th>
          <th class="doctor-table__th">Idade</th>
          <th class="doctor-table__th">T.Esp.</th>
          <th class="doctor-table__th">Status</th>
        </tr>
      </thead>
      <tbody class="doctor-table__body">
        <tr
          class="doctor-table__tr"
          v-for="register in paginatedRegisters"
          v-bind:key="register.id"
          :class="{ 'doctor-table__tr--active': activeRowId === register.id }"
          @click="activateRow(register.id)"
        >
          <td class="doctor-table__td">{{ register.name }}</td>
          <td class="doctor-table__td">{{ register.age || 60 }}</td>
          <td class="doctor-table__td">{{ register.waitTime || '30min' }}</td>
          <td class="doctor-table__td">{{ register.status || 'Fila' }}</td>
        </tr>
      </tbody>
    </table>
    <div class="doctor-table-pagination">
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

export default {
  name: 'DoctorTable',
  data() {
    return {
      registers: [],
      paginatedRegisters: [],
      pageSize: 5,
      pageNumber: 1,
      activeRowId: null,
    };
  },
  computed: {
    nextPageAvailable() {
      return this.pageNumber < (this.registers.length / this.pageSize);
    },
    previousPageAvailable() {
      return !(this.pageNumber === 1);
    },
    totalPages() {
      return this.registers.length / this.pageSize;
    },
  },
  methods: {
    previousPage() {
      if (!this.previousPageAvailable) return;
      this.pageNumber -= 1;
      this.paginate();
    },
    nextPage() {
      if (!this.nextPageAvailable) return;
      this.pageNumber += 1;
      this.paginate();
    },
    paginate() {
      let registers = this.registers || [];
      registers = registers.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
      this.paginatedRegisters = [...registers];
    },
    activateRow(id) {
      this.activeRowId = id;
    },
  },
  async mounted() {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
    this.registers = data || [];
    this.paginate();
  },
};
</script>

<style scoped>
.doctor-table {
  border: 1px solid #CCCCCC;
  border-collapse: collapse;
  width: 100%;
  margin-top: 16px;
  text-align: left;
}

.doctor-table__head {
  font-size: 10px;
}

.doctor-table__head-tr {
  height: 22px;
  color: #505762;
  font-weight: bold;
  padding-left: 8px;
}

.doctor-table__th {
  width: 100%;
  text-align: center;
}

.doctor-table__th--name {
  width: 80%;
}

.doctor-table__th:first-of-type,
.doctor-table__th:last-of-type {
  text-align: left;
  padding-left: 8px;
}

.doctor-table__body {
  font-size: 12px;
  color: #001F3F;
}

.doctor-table__tr {
  height: 26px;
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

.doctor-table-page-number {

}

.doctor-table-icon-pagination {
  font-size: 24px;
}
</style>
