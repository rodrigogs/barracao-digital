<template>
  <v-card id="facility-list">

    <v-card-title>
      Lista de instalações

      <v-spacer></v-spacer>

      <v-btn color="primary" class="mr-2" title="Criar instalação" @click="create">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn color="warning" class="mr-2" title="Editar instalação" @click="edit" :disabled="!hasSelected">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="error" class="mr-2" title="Deletar instalação" @click="remove" :disabled="!hasSelected" :loading="isDeleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="facilitiesList"
        :single-select="true"
        item-key="origin"
        show-select
        class="elevation-1"
      >
      </v-data-table>
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FacilitiesList',

  components: {},

  created() {
    this.refreshList();
  },

  data: () => ({
    headers: [
      { text: 'CEP de origem', value: 'origin' },
      { text: 'Contato', value: 'contact' },
      { text: 'Tipo do contato', value: 'contactType' },
    ],
    selected: [],
    isDeleting: false,
  }),

  methods: {
    ...mapActions('facilities', {
      refreshList: 'refreshList',
      deleteFacility: 'remove',
    }),

    create() {
      this.$router.push('/instalacoes/criar');
    },

    edit() {
      const { origin } = this.selectedFacility;
      this.$router.push(`/instalacoes/editar/${origin}`);
    },

    async remove() {
      try {
        this.isDeleting = true;
        await this.deleteFacility(this.selectedFacility.origin);
        this.$noty.success('Instalação deletada com sucesso');
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar deletar a instalação');
      } finally {
        this.isDeleting = false;
      }
    },
  },

  computed: {
    ...mapGetters('facilities', {
      getFacility: 'get',
      facilitiesList: 'list',
    }),

    hasSelected() {
      return this.selected.length > 0;
    },

    selectedFacility() {
      return this.selected[0];
    },
  },
};
</script>

<style scoped>
</style>
