<template>
  <section class="section">
    <div class="container">
      <div class="img-container">
        <img src="@/assets/logo-grande.png"/>
      </div>
      <form class="form" style="margin-top: 2rem" novalidate>
        <div class="field">
          <label class="label" for="senha">Senha de retorno</label>
          <input :class="{'error': errors.ticket }" v-model="ticket" name="senha" id="senha" class="input" type="password" placeholder="Digite sua senha">
          <span v-if="errors.ticket" class="error">{{errors.ticket}}</span>
        </div>
        <button @click="loadQueuePage()" class="btn btn--link">Entrar</button>
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
</style>
