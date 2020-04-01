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

      <form id="doctor-create-form" v-on:submit.prevent="createDoctor" class="grid">
        <p>
          <label for="username">Nome</label>
          <input id="name" name="name" v-model="form.name" />
        </p>

        <p>
          <label for="username">Nome de Usuário</label>
          <input id="username" name="username" v-model="form.username" />
        </p>

        <p>
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" v-model="form.password" />
        </p>

        <p>
          <label for="cep">CEP da Instalação</label>
          <input id="cep" name="cep" v-model="cep" maxlength="8" />
        </p>

        <p>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" v-model="form.email" />
        </p>

        <p>
          <label for="fu">Estado</label>
          <select id="fu" name="fu" v-model="form.fu">
            <option v-for="state of brazillianStates" :key="state.fu" :value="state.fu">
              {{ state.name }}
            </option>
          </select>
        </p>

        <p>
          <label for="crm">CRM</label>
          <input id="crm" name="crm" v-model="form.crm" />
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
import isEmailValid from '@/utils/isEmailValid';
import states from '@/utils/states';

export default {
  name: 'DoctorCrudCreate',

  data: () => ({
    form: {},
    errors: [],
  }),

  methods: {
    async createDoctor() {
      if (!this.validate()) return;
      try {
        const newDoctor = await this.createDoctorAction({ ...this.form, cep: this.cep });
      } catch (err) {
        console.error(err);
        this.errors.push(err.message);
      }
    },
    validate() {
      const {
        name,
        username,
        password,
        email,
        fu,
        crm,
        admin,
        master,
      } = this.form;

      const { cep } = this;

      this.errors = [];

      if (!name || name.lenght <= 2) {
        this.errors.push('O nome é obrigatório e deve ter no mínimo 3 caracteres.');
      }

      if (!username || username.length <= 2) {
        this.errors.push('O nome de usuário é obrigatório e deve ter no mínimo 3 caracteres.');
      }

      if (!password || password.length < 5) {
        this.errors.push('A senha é obrigatória e deve ter no mínimo 5 caracteres.');
      }

      if (!cep || cep.length < 8) {
        this.errors.push('CEP inválido.');
      }

      if (!email || !isEmailValid(email)) {
        this.errors.push('Email inválido.');
      }

      if (!fu) {
        this.errors.push('A seleção de estado é obrigatória.');
      }

      if (!crm || crm.lenght < 5) {
        this.errors.push('CRM inválido.');
      }

      this.master = !!this.master;
      this.admin = !!this.admin;

      return this.errors.length === 0;
    },
    ...mapActions('doctors', {
      createDoctorAction: 'create',
    }),
  },

  computed: {
    brazillianStates() {
      return states.brazil;
    },

    cep: {
      get() {
        return this.form.cep || this.loggedUser.cep;
      },
      set(newCep) {
        this.form.cep = newCep;
      },
    },

    ...mapGetters('auth', [
      'loggedUser',
    ]),
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid black;
  margin-bottom: 5px;
}

.grid > p {
  padding: 8px;
}
</style>
