<template>
  <div class="container">

    <div class="header">
      <span class="header-title">Paciente selecionado</span>
      <span class="header-subtitle">Fulado de tal</span>
    </div>

    <div class="content">
      <h4>Dados do paciente</h4>

      <div class="content-block">
        <span>Nome do paciente</span>
        <span>Fulano</span>
      </div>

      <div class="content-block">
        <span>Idade</span>
        <span>32</span>
      </div>

      <div class="content-block">
        <span>Tempo em espera</span>
        <span>22 min</span>
      </div>

      <h4>Dados médicos</h4>

      <div class="content-block">
        <span>Usa algum medicamento? Quais?</span>
        <span>-</span>
      </div>

      <div class="content-block">
        <span>Possuí alergias? Quais?</span>
        <span>-</span>
      </div>

      <div class="content-block">
        <span>Possuí convênio? Qual?</span>
        <span>-</span>
      </div>

      <div class="content-block">
        <span>Já foi atendido pelo barração online antes?</span>
        <span>Sim</span>
      </div>

      <h4>Contatos</h4>

      <div class="content-block">
        <span>Telefone</span>
        <span>48996222999</span>
      </div>

      <div class="content-block">
        <span>Whatsapp</span>
        <span>48996222999</span>
      </div>

      <div class="content-block">
        <span>Telegram</span>
        <span>48996222999</span>
      </div>

      <div class="content-block">
        <span>Hangout</span>
        <span>-</span>
      </div>

      <div class="content-block">
        <span>Skype</span>
        <span>-</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'DoctorPatientSummary',
  data() {
    return {
      doctor: 'Little',
      message: null,
      active: null,
    };
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.header {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 60px;
  padding: 16px;
  background: #6C6EA0;
  color: white;
  border-radius: 4px 4px 0 0;
}
.header-title {
  font-weight: bold;
  line-height: 14px;
}
.header-subtitle {
  font-weight: normal;
  font-size: 24px;
  line-height: 19px;
}
.content {
  padding: 16px;
}
.content-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.content-block > span:first-of-type {
  color: #505762;
  font-weight: bold;
}
.content-block > span:last-of-type {
  font-size: 20px;
}
</style>
