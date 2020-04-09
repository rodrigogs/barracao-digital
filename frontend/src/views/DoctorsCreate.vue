<template>
  <v-card id="doctor-create">

    <v-card-title>
      Criar médico

      <v-spacer></v-spacer>

      <v-btn color="success" class="mr-2" title="Listar médicos" @click="cancel">
        <v-icon>mdi-format-list-bulleted-square</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <DoctorForm
        :isLoading="isCreating"
        v-on:submit="create"
        v-on:cancel="cancel"
      />
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DoctorForm from '@/components/DoctorsManagement/Form.vue';

export default {
  name: 'DoctorsCreate',

  components: { DoctorForm },

  data: () => ({
    isCreating: false,
  }),

  methods: {
    ...mapActions('doctors', {
      createDoctor: 'create',
    }),

    async create(doctor) {
      try {
        this.isCreating = true;
        const newDoctor = await this.createDoctor(doctor);
        this.$noty.success('Médico cadastrado com sucesso');
        this.$router.push(`/medicos/editar/${newDoctor.username}`);
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar cadastrar o médico');
      } finally {
        this.isCreating = false;
      }
    },

    cancel() {
      this.$router.push('/medicos');
    },
  },
};
</script>

<style scoped>
</style>
