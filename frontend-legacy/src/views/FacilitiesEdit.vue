<template>
  <v-card id="facility-edit">

    <v-card-title>
      Editar instalação

      <v-spacer></v-spacer>

      <v-btn color="success" class="mr-2" title="Listar instalações" @click="cancel">
        <v-icon>mdi-format-list-bulleted-square</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <FacilityForm
        :facility="facility"
        :isLoading="isUpdating"
        v-on:submit="update"
        v-on:cancel="cancel"
      />
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FacilityForm from '@/components/FacilitiesManagement/Form.vue';

export default {
  name: 'FacilitiesEdit',

  components: { FacilityForm },

  async created() {
    try {
      const { origin } = this.$route.params;
      const facility = await this.getFacility(origin);
      const facilityDestinations = await this.getDestinations(origin);
      this.facility = { ...facility, destinations: facilityDestinations };
    } catch (err) {
      console.error(err);
      this.$noty.error('Ocorreu um erro ao tentar acessar o cadastro da instalação');
      this.$router.push('/instalacoes');
    }
  },

  data: () => ({
    facility: null,
    isUpdating: false,
  }),

  methods: {
    ...mapActions('facilities', {
      getFacility: 'get',
      getDestinations: 'getDestinations',
      updateFacility: 'update',
    }),

    async update(facility) {
      try {
        this.isUpdating = true;
        await this.updateFacility(facility);
        this.$noty.success('Instalação editada com sucesso');
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar editar a instalação');
      } finally {
        this.isUpdating = false;
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
