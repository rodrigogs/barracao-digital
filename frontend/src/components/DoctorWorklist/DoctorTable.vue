<template>
  <div>
    <table class="doctor-table">
      <thead class="doctor-table__head">
        <tr>
          <th class="doctor-table__th doctor-table__th--name">Nome</th>
          <th class="doctor-table__th">Idade</th>
          <th class="doctor-table__th">T.Esp.</th>
          <th class="doctor-table__th">Status</th>
        </tr>
      </thead>
      <tbody class="doctor-table__body">
        <tr v-for="register in registers" v-bind:key="register.id">
          <td class="doctor-table__td">{{ register.name }}</td>
          <td class="doctor-table__td">{{ register.age }}</td>
          <td class="doctor-table__td">{{ register.waitTime }}</td>
          <td class="doctor-table__td">{{ register.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DoctorTable',
  data() {
    return {
      registers: [
        {
          id: new Date().getMilliseconds() + '',
          name: 'Fulano2',
          age: 32,
          waitTime: '49min',
          status: 'Fila',
        },
        {
          id: new Date().getMilliseconds() + '',
          name: 'Fulano2',
          age: 32,
          waitTime: '49min',
          status: 'Fila',
        },
        {
          id: new Date().getMilliseconds() + '',
          name: 'Fulano2',
          age: 32,
          waitTime: '49min',
          status: 'Fila',
        },
        {
          id: new Date().getMilliseconds() + '',
          name: 'Fulano2',
          age: 32,
          waitTime: '49min',
          status: 'Fila',
        },
        {
          id: new Date().getMilliseconds() + '',
          name: 'Fulano2',
          age: 32,
          waitTime: '49min',
          status: 'Fila',
        },
      ],
    };
  },
};
</script>

<style scoped>
.doctor-table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 16px;
}

.doctor-table,
.doctor-table__th,
.doctor-table__td {
  border: 1px solid black;
}

.doctor-table__head {
  font-size: 10px;
}

.doctor-table__th--name {
  width: 80%;
}

.doctor-table__body {
  font-size: 12px;
}
</style>
