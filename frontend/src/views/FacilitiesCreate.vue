<template>
  <section class="section">
    <div class="container">
      <form id="facilitie-form" @submit="doCreate">
        <p>
          <label for="origin">CEP*:</label>
          <input id="origin" name="origin" v-model="origin" />
        </p>

        <p>
          <label for="contactType">Tipo de contato:</label>
          <input id="contactType" name="contactType" v-model="contactType" />
        </p>

        <p>
          <label for="contact">Contato:</label>
          <input id="contact" name="contact" v-model="contact" />
        </p>

        <p>
          <button type="submit">Salvar</button>
        </p>
        <p>
          <button @click="cancel">Cancelar</button>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'FalicitiesCreate',

  data: () => ({
    origin: '',
    contactType: '',
    contact: '',
    errors: [],
  }),

  methods: {
    ...mapActions('facilities', ['create']),
    async doCreate(e) {
      e.preventDefault();

      try {
        if (!this.validate()) return;

        const facilitieData = {};
        if (this.origin) facilitieData.origin = this.origin;
        if (this.contactType) facilitieData.contactType = this.contactType;
        if (this.contact) facilitieData.contact = this.contact;

        await this.create(facilitieData);

        alert('Instalação cadastrada com sucesso');

        this.$router.push('/medicos/instalacoes');
      } catch (err) {
        alert('Não foi possível cadastrar a instalação. Revise os dados inseridos e tente novamente.');
        if (err.response && err.response.status === 401) {
          this.errors.push('Não foi possível cadastrar a instalação. Revise os dados inseridos e tente novamente.');
        } else {
          this.errors.push(err.message);
        }
      }
    },

    validate() {
      const { origin } = this;

      this.errors = [];

      if (!origin) this.errors.push('Campo CEP é obrigatório.');
      return this.errors.length === 0;
    },

    cancel() {
      this.$router.push('/medicos/instalacoes');
    },
  },
};
</script>

<style scoped>
</style>
