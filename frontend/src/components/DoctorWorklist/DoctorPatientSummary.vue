<template>
  <div>
    <div class="container" style="padding: 16px" v-if="!patient || !patient.name">
      Nenhum paciente selecionado
    </div>

    <div class="container" v-if="patient && patient.name">
      <div class="header">
        <span class="header-title">Paciente selecionado</span>
        <span class="header-subtitle">{{ patient.name }}</span>
      </div>

      <div class="content">
        <div class="content-block">
          <h4>Alterar status</h4>
          <select @change="onChangeStatus" v-model="selectedStatus">
            <option value="waiting">Aguardando</option>
            <option value="waiting_kit">Aguardando kit</option>
            <option value="ongoing">Em atendimento</option>
            <option value="finished">Finalizado</option>
          </select>
        </div>

        <h6 v-if="showChangeStatusForm">Feedback do médico:</h6>
        <div v-if="showChangeStatusForm" class="content-block">
          <textarea name="doctorFeedback" id="doctor-feedback" rows="3" v-model="doctorFeedback"></textarea>
          <button class="textarea-send-btn" @click="updateStatus">Enviar</button>
        </div>

        <h4>Dados do paciente</h4>
        <div class="content-block">
          <span>Nome do paciente</span>
          <span>{{ patient.name }}</span>
        </div>
        <div class="content-block">
          <span>Idade</span>
          <span>{{ patient.age }}</span>
        </div>
        <div class="content-block">
          <span>Tempo em espera</span>
          <span>{{ calcTimeWaiting(patient.createdAt) }}</span>
        </div>

        <h4>Dados médicos</h4>
        <div class="content-block">
          <span>Usa algum medicamento? Quais?</span>
          <span>{{ patient.meds }}</span>
        </div>
        <div class="content-block">
          <span>Possuí alergias? Quais?</span>
          <span>{{ patient.allergies }}</span>
        </div>
        <div class="content-block">
          <span>Possuí convênio? Qual?</span>
          <span>{{ patient.covenant }}</span>
        </div>
        <div class="content-block">
          <span>Já foi atendido pelo barração online antes?</span>
          <span>{{ patient.hasBeenAssisted ? 'Sim' : 'Não' }}</span>
        </div>

        <h4>Contatos</h4>
        <div class="content-block">
          <span>Telefone</span>
          <span>{{ patient.phone }}</span>
        </div>
        <div class="content-block">
          <span>Whatsapp</span>
          <span>{{ patient.whatsapp }}</span>
        </div>
        <div class="content-block">
          <span>Telegram</span>
          <span>{{ patient.telegram }}</span>
        </div>
        <div class="content-block">
          <span>Hangout</span>
          <span>{{ patient.hangout }}</span>
        </div>
        <div class="content-block">
          <span>Skype</span>
          <span>{{ patient.skype }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Kairos from 'kairos';

export default {
  name: 'DoctorPatientSummary',
  computed: {
    ...mapState('worklist', ['selectedPatient']),
    patient() {
      return this.selectedPatient;
    },
  },
  data: () => ({
    showChangeStatusForm: false,
    doctorFeedbackRequired: false,
    doctorFeedback: '',
    selectedStatus: null,
    errors: {},
  }),
  methods: {
    ...mapActions('worklist', ['updateSelectedPatientStatus']),
    onChangeStatus() {
      const status = this.selectedStatus;
      if (status === 'ongoing' || status === 'waiting_kit') {
        this.showChangeStatusForm = true;
        this.doctorFeedbackRequired = true;
      } else if (status === 'finished') {
        this.showChangeStatusForm = true;
        this.doctorFeedbackRequired = false;
      } else {
        this.showChangeStatusForm = false;
        this.doctorFeedbackRequired = false;
      }
    },
    // eslint-disable-next-line consistent-return
    async updateStatus() {
      const {
        selectedStatus: status,
        doctorFeedback: message = '',
      } = this;

      this.$delete(this.errors, 'message');
      if (this.doctorFeedbackRequired && (!message || message.length < 10)) {
        this.$set(this.errors, 'message', 'O feedback deve ter no mínimo 10 caracteres.');
      }
      // FIXME pelo amor de deus né...
      if (Object.keys(this.errors).length > 0) {
        return window.alert(this.errors.message);
      }

      await this.updateSelectedPatientStatus({ status, message });

      this.showChangeStatusForm = false;
      this.doctorFeedbackRequired = false;
      this.selectedStatus = status;
      this.doctorFeedback = null;
    },
    calcTimeWaiting(createdAt) {
      const timeWaiting = Date.now() - createdAt;
      const time = Kairos.new(timeWaiting);
      return time.toString('hh:mm');
    },
  },
  watch: {
    selectedPatient() {
      const { status } = this.selectedPatient;
      this.selectedStatus = status;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 16px;
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
