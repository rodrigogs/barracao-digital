<template>
  <section class="section doctor-login">
    <form class="form doctor-login__form" style="margin-top: 2rem" v-on:submit.prevent="doLogin">
      <div class="field">
        <label class="label" for="username">Nome de usuário</label>
        <input :class="{ 'error': errors.username }" v-model="username" name="username" id="username" class="input" placeholder="Ex.: drrodrigo">
        <span v-if="errors.username" class="error">{{ errors.username }}</span>
      </div>
      <div class="field">
        <label class="label" for="password">Senha</label>
        <input :class="{ 'error': errors.password }" v-model="password" name="password" id="password" class="input" type="password">
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      <button class="btn btn--link" type="submit">Entrar</button>
      <div class="field">
        <span v-if="errors.login" class="error">{{ errors.login }}</span>
      </div>
    </form>
  </section>
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'DoctorLogin',

  data: () => ({
    username: '',
    password: '',
    errors: {},
  }),

  methods: {
    async doLogin() {
      try {
        if (!this.validate()) return;

        const { username, password } = this;

        await this.$store.dispatch('auth/login', { username, password });
        this.$router.push('/medicos/fila');
      } catch (err) {
        this.$delete(this.errors, 'login');
        if (err.response && err.response.status === 401) {
          this.$set(this.errors, 'login', 'Não foi possível fazer o login. Verifique seu usuário e senha.');
        } else {
          this.$set(this.errors, 'login', err.message);
        }
      }
    },

    validate() {
      const { username, password } = this;

      this.$delete(this.errors, 'username');
      if (!username || username.length <= 2) this.$set(this.errors, 'username', 'O nome de usuário é obrigatório.');

      this.$delete(this.errors, 'password');
      if (!password || password.length < 5) this.$set(this.errors, 'password', 'A senha é obrigatória.');

      return Object.keys(this.errors).length === 0;
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
