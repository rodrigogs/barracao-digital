<template>
  <div id="doctor-crud-list">
    <h6>Lista de Médicos</h6>
    <div class="grid">
      <span>
        <strong>Id</strong>
      </span>
      <span>
        <strong>Nome de usuário</strong>
      </span>
      <span>
        <strong>CEP</strong>
      </span>
      <span>
        <strong>Email</strong>
      </span>
      <span>
        <strong>Ativo</strong>
      </span>
      <span>
        <strong>Admin</strong>
      </span>
      <span>
        <strong>Master</strong>
      </span>
      <span v-for="(field, index) in orderedFieldsList" :key="index">{{ field }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorCrudList',

  components: {},

  created() {
    this.refreshList({ cep: this.loggedUser.cep });
  },

  data: () => ({
    orderedListFields: [
      'id',
      'username',
      'cep',
      'email',
      'active',
      'admin',
      'master',
    ],
  }),

  methods: {
    ...mapActions('doctors', [
      'refreshList',
    ]),
  },

  computed: {
    orderedFieldsList() {
      return this.doctorsList
        .flatMap((doctor) => this.orderedListFields
          .map((field) => doctor[field]));
    },
    ...mapGetters('auth', [
      'loggedUser',
    ]),
    ...mapGetters('doctors', {
      getDoctor: 'get',
      doctorsList: 'list',
    }),
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid black;
  border-right: 1px solid black;
}

.grid > span {
  padding: 8px;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
