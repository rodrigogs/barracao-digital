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
        <strong style="font-size: 28px;">{{ patient.ticket }}</strong>
      </div>

      <div class="patient-enqueued__text" style="width: 220px;">
        Caso você perca a conexão, retorne à fila de atendimento usando a senha acima.
      </div>
    </div>

    <div v-if="!isLoading && patient.status === 'ongoing'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        O médico <strong>{{ patient.ongoingDoctorDoctorName }}</strong> está entrando em contato com você.
        <br>
        Siga as instruções abaixo:
        <br>
        <br>
        <textarea id="doctor-ongoing-feedback" cols="50" rows="3" v-model="patient.ongoingDoctorFeedback" readonly></textarea>
      </div>
    </div>

    <div v-if="!isLoading && patient.status === 'finished'" class="container">
      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        O atendimento foi finalizado pelo médico <strong>{{ patient.finishedDoctorDoctorName }}</strong>.
        <br v-if="patient.finishedDoctorFeedback">
        <span v-if="patient.finishedDoctorFeedback">Confira o feedback abaixo:</span>
        <br v-if="patient.finishedDoctorFeedback">
        <br>
        <textarea id="doctor-finished-feedback" cols="50" rows="3" v-if="patient.finishedDoctorFeedback" v-model="patient.finishedDoctorFeedback" readonly></textarea>
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        <span v-if="!patient.patientFeedback">Avalie o seu atendimento:</span>
        <span v-if="patient.patientFeedback">Você avaliou seu atendimento como:</span>
        <br>
        <div class="stars-box">
          <button v-for="index in patient.patientFeedback || 0" :key="index" class="star" :disabled="!!patient.patientFeedback"></button>
          <button v-for="index in (10-(patient.patientFeedback || 0))" :key="index" class="star star--empty" @click="sendPacientFeedback(index)" :disabled="!!patient.patientFeedback"></button>
        </div>
        <button type="button" v-if="!patient.patientFeedback">
          Avaliar
        </button>
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

    <div v-if="!isLoading && patient.status === 'facility_not_available'" class="container">
      <FacilityNotAvailable />
    </div>
  </section>
</template>

<script>
import Kairos from 'kairos';
import Loader from '@/components/Loader.vue';
import FacilityNotAvailable from '@/components/FacilityNotAvailable.vue';
import { patients as patientsApi } from '@/api';

export default {
  name: 'PatientEnqueued',
  components: { Loader, FacilityNotAvailable },
  computed: {
    timePast() {
      return this.patient.createdAt;
    },
  },
  data() {
    return {
      isLoading: true,
      patient: {},
      reloaderInterval: null,
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
    sendPacientFeedback(starQt) {
      console.log(starQt);
    },
  },
  async mounted() {
    const patientTicket = this.$route.params.ticket;
    this.isLoading = true;
    if (!patientTicket) {
      this.$router.push('/');
      return;
    }

    try {
      this.patient = await patientsApi.getPatientByTicket(patientTicket);
      if (this.patient.status === 'waiting') {
        this.reloaderInterval = setInterval(this.reloadPacientData, 60000);
      }
    } catch (err) {
      console.log('bla');
      if (String(err.response.status) === '404') {
        this.$router.push({ name: 'NotFound' });
      }
      // TODO handle the error
    } finally {
      this.isLoading = false;
    }
  },
  beforeDestroy() {
    console.log('Clearing reloader interval');
    clearInterval(this.reloaderInterval);
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

  #doctor-ongoing-feedback {
    resize: both;
    margin-top: 10px;
  }

  .stars-box {
    direction: rtl;
  }

  .star {
    align-items: center;
    display: inline-flex;
    font-size: 2rem;
    justify-content: center;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
    padding: 0.5rem;
    cursor: pointer;
    outline: none;
    transform: scaleX(1);
    border: none;
    background-color: transparent;
    color: gold;
  }

  .star::before {
    content: "\2605";
  }

  .star--empty::before {
    content: "\2606";
  }

  .star:hover:before,
  .star:hover ~ .star:before {
    content: "\2605";
    color: gold;
  }
</style>
