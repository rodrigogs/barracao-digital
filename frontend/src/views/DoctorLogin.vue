<template>
  <v-app id="doctor-login-app">
    <section class="section doctor-login">
      <v-form ref="form" class="form doctor-login__form" style="margin-top: 2rem" v-on:submit.prevent="doLogin">
        <v-text-field
          id="username"
          name="username"
          v-model="username"
          :rules="rules.username"
          maxlength="50"
          label="Nome de usuário"
          hint="Exemplo: drrodrigo"
          required
        ></v-text-field>

        <v-text-field
          id="password"
          name="password"
          v-model="password"
          :rules="rules.password"
          maxlength="50"
          label="Senha"
          type="password"
          required
        ></v-text-field>

        <v-btn
          color="primary"
          type="submit"
          x-large
          :loading="loading"
        >Entrar</v-btn>

      </v-form>
    </section>
  </v-app>
</template>

<script>
import Logo from '@/components/Logo.vue';
import { mapActions } from 'vuex';

export default {
  name: 'DoctorLogin',

  data: () => ({
    username: '',
    password: '',
    errors: {},
    rules: {
      username: [(v) => !!v || 'O nome de usuário é obrigatório'],
      password: [(v) => !!v || 'A senha é obrigatória'],
    },
    loading: false,
  }),

  methods: {
    ...mapActions('auth', {
      login: 'login',
    }),

    async doLogin() {
      try {
        this.loading = true;
        if (!this.validate()) return;

        const { username, password } = this;

        await this.login({ username, password });

        this.$router.push('/medicos/fila');
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          this.$noty.error('Não foi possível fazer login. Verifique seu usuário e senha.');
        } else {
          this.$noty.error(err.message);
        }
      } finally {
        this.loading = false;
      }
    },

    validate() {
      return this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
.doctor-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.doctor-login__form {
  max-width: 400px;
  width: 100%;
  margin: auto;
  margin-top: 2rem;
}
</style>
