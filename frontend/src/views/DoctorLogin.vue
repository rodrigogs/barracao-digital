<template>
  <section class="section">
    <div class="container">
      <form id="doctor-login" @submit="doLogin">
        <p v-if="errors.length > 0">
          <strong>Erros encontrados:</strong>
          <ul>
            <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="username">Nome de Usuário</label>
          <input id="username" name="username" v-model="username" />
        </p>

        <p>
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" v-model="password" />
        </p>

        <p>
          <button type="submit" value="Login">Login</button>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'DoctorLogin',

  data: () => ({
    username: '',
    password: '',
    errors: [],
  }),

  methods: {
    async doLogin(e) {
      e.preventDefault();

      try {
        if (!this.validate()) return;

        const { username, password } = this;

        await this.$store.dispatch('auth/login', { username, password });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          this.errors.push('Não foi possível fazer o login. Verifique seu usuário e senha.');
        } else {
          this.errors.push(err.message);
        }
      }
    },

    validate() {
      const { username, password } = this;

      this.errors = [];

      if (!username) this.errors.push('O nome de usuário é obrigatório.');
      if (username.length <= 2) this.errors.push('O nome de usuário deve ter no mínimo 3 caracteres.');

      if (!password) this.errors.push('A senha é obrigatória.');
      if (password.length < 5) this.errors.push('A senha deve ter no mínimo 5 caracteres.');

      return this.errors.length === 0;
    },
  },
};
</script>

<style scoped>
</style>
