<template>
  <v-card id="facility-create">

    <v-card-title>
      Criar instalação

      <v-spacer></v-spacer>

      <v-btn color="success" class="mr-2" title="Listar instalações" @click="cancel">
        <v-icon>mdi-format-list-bulleted-square</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <FacilityForm
        :isLoading="isCreating"
        v-on:submit="create"
        v-on:cancel="cancel"
      />
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FacilityForm from '@/components/FacilitiesManagement/Form.vue';

export default {
  name: 'FacilitiesCreate',

  components: { FacilityForm },

  data: () => ({
    isCreating: false,
  }),

  methods: {
    ...mapActions('facilities', {
      createFacility: 'create',
    }),

    async create(facility) {
      try {
        this.isCreating = true;
        const newFacility = await this.createFacility(facility);
        this.$noty.success('Instalação cadastrado com sucesso');
        this.$router.push(`/instalacoes/editar/${newFacility.origin}`);
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar cadastrar a instalação');
      } finally {
        this.isCreating = false;
      }
    },

    cancel() {
      this.$router.push('/instalacoes');
    },
  },
};
</script>

<style scoped>
</style>
