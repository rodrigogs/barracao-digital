<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col >
          <div class="content-block">
            <h4>Status</h4>
            <ChangeStatusDialog :currentStatus="patient.status" />
          </div>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <h4>Dados do paciente</h4>
      <v-row>
        <v-col>
          <div class="content-block">
            <span>Nome do paciente</span>
            <span>{{ patient.name }}</span>
          </div>
        </v-col>
        <v-col>
          <div class="content-block">
            <span>Idade</span>
            <span>{{ patient.age }}</span>
          </div>
        </v-col>
        <v-col>
          <div class="content-block">
            <span>Tempo em espera</span>
            <span>{{ calcTimeWaiting(patient.createdAt) }}</span>
          </div>
        </v-col>
        <v-col>
          <div class="content-block">
            <span>Senha</span>
            <span>{{ patient.ticket }}</span>
          </div>
        </v-col>
      </v-row>

      <h4>Dados médicos</h4>
      <v-row>
        <v-col v-if="patient.meds">
          <div class="content-block">
            <span>Medicamentos</span>
            <span>{{ patient.meds }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.allergies">
          <div class="content-block">
            <span>Alergias</span>
            <span>{{ patient.allergies }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.covenant">
          <div class="content-block">
            <span>Convênio</span>
            <span>{{ patient.covenant }}</span>
          </div>
        </v-col>
        <v-col>
          <div class="content-block">
            <span>Já foi atendido anteriormente?</span>
            <span>{{ patient.hasBeenAssisted ? 'Sim' : 'Não' }}</span>
          </div>
        </v-col>
      </v-row>

      <h4>Contatos</h4>
      <v-row>
        <v-col v-if="patient.phone">
          <div class="content-block">
            <span>Telefone</span>
            <span>{{ patient.phone }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.whatsapp">
          <div class="content-block">
            <span>Whatsapp</span>
            <span>{{ patient.whatsapp }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.telegram">
          <div class="content-block">
            <span>Telegram</span>
            <span>{{ patient.telegram }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.hangout">
          <div class="content-block">
            <span>Hangout</span>
            <span>{{ patient.hangout }}</span>
          </div>
        </v-col>
        <v-col v-if="patient.skype">
          <div class="content-block">
            <span>Skype</span>
            <span>{{ patient.skype }}</span>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import Kairos from 'kairos';
import ChangeStatusDialog from './ChangeStatusDialog.vue';

export default {
  name: 'DoctorPatientSummary',
  components: {
    ChangeStatusDialog,
  },
  computed: {
    ...mapGetters('worklist', [
      'selectedPatient',
    ]),
    patient() {
      return this.selectedPatient;
    },
  },
  data: () => ({
    errors: {},
  }),
  methods: {
    calcTimeWaiting(createdAt) {
      const timeWaiting = Date.now() - createdAt;
      const time = Kairos.new(timeWaiting);
      return time.toString('hh:mm');
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
