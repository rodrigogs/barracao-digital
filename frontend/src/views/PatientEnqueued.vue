<template>
  <section class="section">
    <div v-if="isLoading" class="container">
      <div class="patient-enqueued__loader">
        <div class="loader"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'waiting'" class="container">
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
        Sua senha para retorno é {{patient.ticket}}
      </div>

      <div class="patient-enqueued__text" style="width: 220px;">
        Caso perca a conexão, retorne a fila de atendimento usando essa senha
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'ongoing'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Um médico está entrando em contato com você
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'finished'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Atendimento finalizado
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'cant_be_assisted'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
        {{patient.name}}, nossa equipe está sobrecarregada no momento.
      </div>
      <div class="patient-enqueued__text">
        Tente novamente mais tarde.
      </div>

<!--      <p>Caso aceite receber atendimento em outro horário, selecione abaixo:</p>-->
<!--      <p>Aceito aguardar</p>-->
    </div>
    <div v-if="!isLoading && patient.status === 'shed_not_available'" class="container">
      <div class="patient-enqueued__big-warn">
        O serviço online do seu CEP
        não está ativo nesse momento.
      </div>
      <div class="patient-enqueued__big-warn">
        Você pode tentar novamente tarde.
      </div>
    </div>
  </section>
</template>

<script>
import { patients as patientsApi } from '@/api';

export default {
  name: 'PatientEnqueued',
  components: {},
  data() {
    return {
      isLoading: true,
      patient: {},
    };
  },
  method: {
    async reloadPacientData() {
      this.isLoading = true;
      this.patient = await patientsApi.getPatientByTicket(this.patient.ticket);
      this.isLoading = false;
    },
  },
  async mounted() {
    const patientTicket = this.$route.params.ticket;
    this.isLoading = true;
    if (!patientTicket) {
      this.$router.push('/');
      return;
    }

    this.patient = await patientsApi.getPatientByTicket(patientTicket);
    this.isLoading = false;
    setInterval(this.reloadPacientData, 60000);
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
