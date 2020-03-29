<template>
  <section id="doctor-crud-create">
    <div class="container">
      <h6>Criar Médico</h6>

      <p v-if="errors.length > 0">
        <strong>Erros encontrados:</strong>
        <ul>
          <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
        </ul>
      </p>

      <form id="doctor-create-form" @submit="createDoctor" class="grid">
        <p>
          <label for="username">Nome de Usuário</label>
          <input id="username" name="username" v-model="form.username" />
        </p>

        <p>
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" v-model="form.password" />
        </p>

        <p>
          <label for="cep">CEP</label>
          <input id="cep" name="cep" v-model="form.cep" maxlength="8" />
        </p>

        <p>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" v-model="form.email" />
        </p>

        <p>
          <label for="active">Ativo</label>
          <input id="active" name="active" type="checkbox" v-model="form.active" />
        </p>

        <p>
          <label for="admin">Admin</label>
          <input id="admin" name="admin" type="checkbox" v-model="form.admin" />
        </p>

        <p>
          <label for="master">Master</label>
          <input id="master" name="master" type="checkbox" v-model="form.master" />
        </p>

        <p>
          <button type="submit" value="Login">Criar</button>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorCrudCreate',

  data: () => ({
    form: {},
    errors: [],
  }),

  methods: {
    createDoctor() {
      const form = this;
      // TODO continue
    },
    ...mapActions('doctors', [
      'create',
    ]),
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid black;
  margin-bottom: 5px;
}

.grid > p {
  padding: 8px;
}
</style>
