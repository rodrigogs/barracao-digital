<template>
  <section class="section patient-login">
    <router-link to="/" class="patient-login__logo">
      <Logo />
      </router-link>
      <form class="form patient-login__form" style="margin-top: 2rem" @submit.prevent="loadQueuePage()" novalidate>
        <div class="field">
          <label class="label" for="senha">Senha de retorno</label>
          <input :class="{'error': errors.ticket }" v-model="ticket" name="senha" id="senha" class="input" type="password" placeholder="Digite sua senha">
          <span v-if="errors.ticket" class="error">{{errors.ticket}}</span>
        </div>
        <button class="btn btn--link">Entrar</button>
      </form>
  </section>
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'PatientLogin',
  components: { Logo },
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

<style scoped>
.patient-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  }

  .patient-login__form {
    max-width: 400px;
  width: 100%;
    margin: auto;
  margin-top: 2rem;
  }
</style>
