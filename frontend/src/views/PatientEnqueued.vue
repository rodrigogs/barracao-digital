<template>
  <section class="section">
    <Loader class="patient-enqueued__loader" v-if="isLoading" />
    <div v-if="!isLoading && patient.status === 'waiting'" class="container">
      <div class="patient-enqueued__lightweight-warn">
        Essa página é atualizada automaticamente a cada 1 minuto
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Você está na fila de atendimento
      </div>

      <div class="patient-enqueued__text" style="width: 250px;">
        Fique com o telefone e suas formas de comunicação disponiveis e online.
        <br>
        <br>
        <strong>Assim que possível um médico entrará em contato com você.</strong>
      </div>

      <div class="patient-enqueued__small-text">
        Tempo na fila: {{ calcTimeWaiting(timePast) }}
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
        Sua senha de retorno é
        <br>
        <strong style="font-size: 28px;">{{ Number(patient.ticket) }}</strong>
      </div>

      <div class="patient-enqueued__text" style="width: 220px;">
        Caso você perca a conexão, retorne à fila de atendimento usando a senha acima.
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'ongoing'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Um médico está entrando em contato com você.
      </div>
    </div>
    <div v-if="!isLoading && patient.status === 'finished'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Atendimento finalizado.
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
import Kairos from 'kairos';
import Loader from '@/components/Loader.vue';
import { patients as patientsApi } from '@/api';

export default {
  name: 'PatientEnqueued',
  components: { Loader },
  computed: {
    timePast() {
      return this.patient.createdAt;
    },
  },
  data() {
    return {
      isLoading: true,
      patient: {},
    };
  },
  methods: {
    async reloadPacientData() {
      this.isLoading = true;
      this.patient = await patientsApi.getPatientByTicket(this.$route.params.ticket);
      this.isLoading = false;
    },
    calcTimeWaiting(createdAt) {
      const timeWaiting = Date.now() - createdAt;
      const time = Kairos.new(timeWaiting);
      return time.toString('hh:mm');
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
