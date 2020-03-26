<template>
  <section class="section">
    <div v-if="isLoading" class="container">
      <div class="patient-enqueued__loader">
        <div class="loader"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
    <div v-if="!isLoading && status === 0" class="container">
      <div class="patient-enqueued__lightweight-warn">
        Essa página é atualizada automaticamente a cada 1 minuto
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Você esta na fila de atendimento
      </div>

      <div class="patient-enqueued__text" style="width: 250px;">
        Estamos trabalhando, fique com o telefone e suas formas de comunicação disponiveis e online!
      </div>

      <div class="patient-enqueued__small-text">
        Tempo na fila: 12:56
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
        Sua senha para retorno é {{patientTicket}}
      </div>

      <div class="patient-enqueued__text" style="width: 220px;">
        Caso perca a conexão, retorne a fila de atendimento usando essa senha
      </div>
    </div>
    <div v-if="!isLoading && status === 1" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Um médico está entrando em contato com você
      </div>
    </div>
    <div v-if="!isLoading && status === 2" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Atendimento finalizado
      </div>
    </div>
    <div v-if="!isLoading && status === 3" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
        Fulano, nossa equipe está sobrecarregada no momento.
      </div>
      <div class="patient-enqueued__text">
        Tente novamente mais tarde.
      </div>

<!--      <p>Caso aceite receber atendimento em outro horário, selecione abaixo:</p>-->
<!--      <p>Aceito aguardar</p>-->
    </div>
  </section>
</template>

<script>
export default {
  name: 'PatientEnqueued',
  components: {},
  data() {
    return {
      patientTicket: 0,
      isLoading: true,
      status: 3,
    };
  },
  method: {

  },
  mounted() {
    this.patientTicket = this.$route.params.ticket;
    this.isLoading = true;
  },
};
</script>

<style>
  .patient-enqueued__loader {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }

  .patient-enqueued__lightweight-warn {
    color: #6F8194;
    width: 215px;
    text-align: center;
    font-size: .75rem;
    margin: auto;
  }

  .patient-enqueued__big-warn {
    text-align: center;
    font-size: 1.3rem;
    margin: auto;
    font-weight: bold;
    margin-top: 3rem;
  }

  .patient-enqueued__big-warn--blue {
    color: var(--main-btn-color);
  }

  .patient-enqueued__big-warn--red {
    color: var(--secondary-btn-color);
  }

  .patient-enqueued__text {
    margin: auto;
    margin-top: 1rem;
    font-size: 1rem;
    text-align: center;
  }

  .patient-enqueued__small-text {
    margin-top: .5rem;
    text-align: center;
    font-size: .75rem;
    font-weight: bold;
  }
</style>
