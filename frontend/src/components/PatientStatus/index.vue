<template>
  <v-container>
    <Loader class="patient-enqueued__loader" v-if="isLoading" />

    <div v-else-if="patient.status === 'waiting'">
      <Waiting/>
    </div>

    <div v-else-if="patient.status === 'ongoing'">
      <Ongoing/>
    </div>

    <div v-else-if="patient.status === 'finished'">
      <Finished/>
    </div>

    <div v-else-if="patient.status === 'cant_be_assisted'">
      <CantBeAssisted/>
    </div>

    <div v-else-if="patient.status === 'facility_not_available'">
      <FacilityNotAvailable/>
    </div>

    <div v-else-if="patient.status === 'waiting_kit'">
      <WaitingKit/>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { messaging } from '@/providers/firebase';
import { patients as patientsApi } from '@/api';
import Loader from '@/components/Loader.vue';
import CantBeAssisted from './CantBeAssisted.vue';
import FacilityNotAvailable from './FacilityNotAvailable.vue';
import Finished from './Finished.vue';
import Ongoing from './Ongoing.vue';
import Waiting from './Waiting.vue';
import WaitingKit from './WaitingKit.vue';

export default {
  name: 'PatientStatus',
  components: {
    Loader,
    CantBeAssisted,
    FacilityNotAvailable,
    Finished,
    Ongoing,
    Waiting,
    WaitingKit,
  },
  data() {
    return {
      isLoading: true,
      patient: {},
      reloaderInterval: null,
    };
  },
  methods: {
    ...mapActions('patients', [
      'loginPatient',
    ]),
    async reloadPacientData() {
      this.isLoading = true;
      this.patient = await patientsApi.getPatientByTicket(this.$route.params.ticket);
      this.isLoading = false;
    },
    async handleMessaging() {
      try {
        const { patient } = this;
        await messaging.requestPermission();
        const currentToken = await messaging.getToken();
        await this.updatePatientMessagingToken(currentToken);
        messaging.onTokenRefresh(async () => {
          const updatedToken = await messaging.getToken();
          await this.updatePatientMessagingToken(updatedToken);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updatePatientMessagingToken(newToken) {
      await patientsApi.setMessagingToken({ ticket: this.patient.ticket, token: newToken });
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
      await this.loginPatient(this.patient);
      await this.handleMessaging();
      if (this.patient.status === 'waiting') { // FIXME should be removed when using firestore
        this.reloaderInterval = setInterval(this.reloadPacientData, 60000);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        this.$noty.error('Senha inválida');
        this.$router.push({ name: 'PatientLogin' });
      } else {
        this.$noty.error('Ocorreu um erro ao tentar acessar a fila');
        console.error(err);
      }
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

  .stars-box--ltr {
    direction: ltr;
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

  .star:disabled {
    cursor: default;
  }

  .star::before {
    content: "\2605";
  }

  .star--empty::before {
    content: "\2606";
  }

  .star:not(:disabled):hover:before,
  .star:not(:disabled):hover ~ .star:before {
    content: "\2605";
    color: gold;
  }
</style>
