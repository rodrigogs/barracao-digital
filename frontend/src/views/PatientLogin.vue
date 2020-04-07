<template>
  <v-app id="patient-login-app">
    <section class="section patient-login">
      <router-link to="/" class="patient-login__logo">
        <Logo />
      </router-link>

      <v-form
        class="form patient-login__form"
        style="margin-top: 2rem"
        @submit.prevent="loadQueuePage()"
        novalidate
      >
        <v-text-field
          v-model="ticket"
          :rules="ticketRules"
          maxlength="9"
          label="Senha de retorno"
          required
          v-mask="'########'"
        ></v-text-field>

        <button class="btn btn--link" type="submit">Entrar</button>
      </v-form>
    </section>
  </v-app>
</template>

<script>
import { mask } from 'vue-the-mask';
import Logo from '@/components/Logo.vue';

export default {
  name: 'PatientLogin',
  components: { Logo },
  directives: { mask },
  data() {
    return {
      ticket: '',
      ticketRules: [
        (v) => !!v || 'A senha deve ser preenchida',
        (v) => (v && v.length < 9) || 'A senha deve ter 9 caracteres',
      ],
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
