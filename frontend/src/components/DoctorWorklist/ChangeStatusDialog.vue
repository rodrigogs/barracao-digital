<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-col>
          <v-btn color="primary" dark v-on="on">
            {{ statusMessage }}
            <v-icon>mdi-swap-horizontal</v-icon>
          </v-btn>
        </v-col>
      </template>

      <v-card>
        <v-form ref="form">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Alterar status do paciente</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                :disabled="!validStatus"
                @click="updateStatus"
                :loading="updatingStatus"
              >Salvar</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container>

              <v-row>
                <v-select
                  v-model="selectedStatus"
                  :items="statusFilterItems"
                  :rules="rules.status"
                  label="Status"
                  required
                ></v-select>
              </v-row>

              <v-row>
                <v-select
                  v-if="selectedStatus === 'finished'"
                  label="Desfecho do paciente"
                  name="outcome"
                  :items="patientOutcomeItems"
                  v-model="patientOutcome"
                  :rules="rules.outcome"
                ></v-select>
              </v-row>

              <v-row>
                <v-textarea
                  v-model="doctorFeedback"
                  name="doctorFeedback"
                  id="doctorFeedback"
                  maxlength="255"
                  label="Feedback para o paciente"
                  outlined
                  rows="2"
                  counter
                  :rules="rules.doctorFeedback"
                ></v-textarea>
              </v-row>

            </v-container>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ChangeStatusDialog',
  props: {
    currentStatus: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      updatingStatus: false,
      validStatus: false,
      doctorFeedback: '',
      patientOutcome: '',
      patientOutcomeItems: [
        {
          text: 'Caso suspeito isolamento domiciliar',
          value: 'suspect_case_home_isolation',
        },
        {
          text: 'Caso suspeito referenciado',
          value: 'suspect_case_referenced',
        },
        {
          text: 'Caso sem suspeita',
          value: 'non_suspect_case',
        },
        {
          text: 'Caso sem suspeita referenciado',
          value: 'non_suspect_case_referenced',
        },
      ],
      selectedStatus: '',
      statusFilterItems: [
        {
          text: 'Aguardando',
          value: 'waiting',
        },
        {
          text: 'Em andamento',
          value: 'ongoing',
        },
        {
          text: 'Finalizado',
          value: 'finished',
        },
        {
          text: 'Aguardando kit',
          value: 'waiting_kit',
        },
        {
          text: 'Não pode ser atendido',
          value: 'cant_be_assisted',
        },
      ],
      rules: {
        status: [],
        outcome: [(v) => {
          if (this.selectedStatus !== 'finished') return true;
          return !!v || 'Ao finalizar o atendimento você deve selecionar um desfecho';
        }],
        doctorFeedback: [(v) => {
          const requiredStatuses = ['ongoing', 'waiting_kit'];
          if (requiredStatuses.indexOf(this.selectedStatus) === -1) return true;
          if (!v) return 'Um feedback é necessário para este status';
          return v.length >= 10 || 'O feedback deve ter mais de 10 caracteres';
        }],
      },
    };
  },
  computed: {
    ...mapGetters('worklist', [
      'selectedPatient',
    ]),
    statusMessage() {
      const { currentStatus: status } = this;
      if (status === 'waiting') return 'Aguardando';
      if (status === 'waiting_kit') return 'Aguardando kit';
      if (status === 'ongoing') return 'Em andamento';
      if (status === 'finished') return 'Finalizado';
      return 'Sem status';
    },
  },
  methods: {
    ...mapActions('worklist', ['updateSelectedPatientStatus']),
    closeDialog() {
      this.dialog = false;
    },
    async updateStatus() {
      const {
        selectedStatus: status,
        doctorFeedback: message,
        patientOutcome: outcome,
      } = this;
      try {
        this.updatingStatus = true;
        if (!this.$refs.form.validate()) return;

        await this.updateSelectedPatientStatus({ status, message, outcome });
        this.$noty.success('Status atualizado');

        this.reset();
        this.closeDialog();
      } catch (err) {
        this.$noty.error('Erro ao atualizar o status do paciente');
        console.error(err);
      } finally {
        this.updatingStatus = false;
      }
    },
    reset() {
      this.doctorFeedback = null;
    },
  },
  watch: {
    dialog() {
      this.selectedStatus = this.selectedPatient ? this.selectedPatient.status : null;
    },
    selectedStatus() {
      const status = this.selectedStatus;
      if (status === 'waiting') {
        this.validStatus = false;
      } else if (status === 'ongoing' || status === 'waiting_kit') {
        this.validStatus = true;
      } else if (status === 'finished') {
        this.validStatus = true;
      } else {
        this.validStatus = false;
      }
    },
  },
};
</script>
