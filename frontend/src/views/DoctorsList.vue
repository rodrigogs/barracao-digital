<template>
  <v-card>

    <v-card-title>
      Lista de Médicos

      <v-spacer></v-spacer>

      <v-btn color="primary" class="mr-2" title="Criar médico" @click="create">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn color="warning" class="mr-2" title="Editar médico" @click="edit" :disabled="!hasSelected">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="error" class="mr-2" title="Deletar médico" @click="remove" :disabled="!hasSelected" :loading="isDeleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="doctorsList"
        :single-select="true"
        item-key="username"
        show-select
        class="elevation-1"
      >

        <template v-slot:item.active="{ item }">
          <v-switch value :input-value="item.active" readonly></v-switch>
        </template>

        <template v-slot:item.admin="{ item }">
          <v-switch value :input-value="item.admin" readonly></v-switch>
        </template>

        <template v-slot:item.master="{ item }">
          <v-switch value :input-value="item.master" readonly></v-switch>
        </template>

      </v-data-table>
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorsList',

  components: {},

  created() {
    this.refreshList({ cep: this.loggedUser.cep });
  },

  data: () => ({
    headers: [
      { text: 'Nome', value: 'name' },
      { text: 'Nome de usuário', value: 'username' },
      { text: 'Instalação', value: 'cep' },
      { text: 'Email', value: 'email' },
      { text: 'Ativo?', value: 'active' },
      { text: 'Admin?', value: 'admin' },
      { text: 'Master?', value: 'master' },
    ],
    selected: [],
    isDeleting: false,
  }),

  methods: {
    ...mapActions('doctors', {
      refreshList: 'refreshList',
      deleteDoctor: 'remove',
    }),

    create() {
      this.$router.push('/medicos/criar');
    },

    edit() {
      const [{ username }] = this.selected;
      this.$router.push(`/medicos/editar/${username}`);
    },

    async remove() {
      try {
        this.isDeleting = true;
        await this.deleteDoctor(this.selectedUser.username);
        this.$noty.success('Médico deletado com sucesso');
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar deletar o médico');
      } finally {
        this.isDeleting = false;
      }
    },
  },

  computed: {
    ...mapGetters('auth', [
      'loggedUser',
    ]),

    ...mapGetters('doctors', {
      getDoctor: 'get',
      doctorsList: 'list',
    }),

    hasSelected() {
      return this.selected.length > 0;
    },

    selectedUser() {
      return this.selected[0];
    },
  },
};
</script>

<style scoped>
</style>
