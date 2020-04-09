<template>
  <v-card id="doctor-edit">

    <v-card-title>
      Editar médico

      <v-spacer></v-spacer>

      <v-btn color="success" class="mr-2" title="Listar médicos" @click="cancel">
        <v-icon>mdi-format-list-bulleted-square</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <DoctorForm
        :doctor="doctor"
        :isLoading="isUpdating"
        v-on:submit="update"
        v-on:cancel="cancel"
      />
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DoctorForm from '@/components/DoctorsManagement/Form.vue';

export default {
  name: 'DoctorsEdit',

  components: { DoctorForm },

  async created() {
    try {
      const { username } = this.$route.params;
      const doctor = await this.getDoctor(username);
      this.doctor = { ...doctor };
    } catch (err) {
      console.error(err);
      this.$noty.error('Ocorreu um erro ao tentar acessar o cadastro do médico');
      this.$router.push('/medicos');
    }
  },

  data: () => ({
    doctor: null,
    isUpdating: false,
  }),

  methods: {
    ...mapActions('doctors', {
      getDoctor: 'get',
      updateDoctor: 'update',
    }),

    async update(doctor) {
      try {
        this.isUpdating = true;
        await this.updateDoctor(doctor);
        this.$noty.success('Médico editado com sucesso');
      } catch (err) {
        console.error(err);
        this.$noty.error('Ocorreu um erro ao tentar editar o médico');
      } finally {
        this.isUpdating = false;
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
