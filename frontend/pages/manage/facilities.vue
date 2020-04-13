<template>
  <v-container fluid>
    <v-card elevation="0" append>
      <v-toolbar color="primary" flat dark dense>
        <v-toolbar-title>Lista de instalações</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-if="$auth.user.admin"
          icon
          title="Criar instalação"
          @click="create"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="facilities"
        item-key="origin"
        class="elevation-1"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: ['auth', 'isAdminOrMaster'],
  data: () => ({
    facilities: [],
    headers: [
      { text: 'CEP de origem', value: 'origin' },
      { text: 'Contato', value: 'contact' },
      { text: 'Tipo do contato', value: 'contactType' }
    ],
    selected: [],
    isDeleting: false
  }),
  computed: {
    hasSelected() {
      return this.selected.length > 0
    },

    selectedFacility() {
      return this.selected[0]
    }
  },
  methods: {
    create() {},
    edit() {},
    remove() {}
  }
}
</script>
