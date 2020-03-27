<template>
  <section class="section">
    <div class="container">
      <router-link to="/" class="img-container patient-login__img-logo">
        <img src="@/assets/logo-grande.png"/>
      </router-link>
      <form class="form patient-login__form" style="margin-top: 2rem" @submit.prevent="loadQueuePage()" novalidate>
        <div class="field">
          <label class="label" for="senha">Senha de retorno</label>
          <input :class="{'error': errors.ticket }" v-model="ticket" name="senha" id="senha" class="input" type="password" placeholder="Digite sua senha">
          <span v-if="errors.ticket" class="error">{{errors.ticket}}</span>
        </div>
        <button class="btn btn--link">Entrar</button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PatientLogin',
  components: {},
  data() {
    return {
      ticket: '',
      errors: {},
    };
  },
  methods: {
    loadQueuePage() {
      this.$delete(this.errors, 'ticket');
      if (!this.ticket) {
        this.$set(this.errors, 'ticket', 'Digite uma senha');
        return;
      }

      this.$router.push(`/pacientes/senha/${this.ticket}`);
    },
  },
};
</script>

<style>
  .patient-login__img-logo {
    max-width: 600px;
    margin: auto;
  }

  .patient-login__form {
    max-width: 400px;
    margin: auto;
  }
</style>
