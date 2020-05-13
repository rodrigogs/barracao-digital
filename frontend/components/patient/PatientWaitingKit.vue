<template>
  <div>
    <v-card>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title>
          Um kit médico está sendo enviado para você
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="text-center">
        <v-timeline align-top dense>
          <v-expand-transition>
            <v-timeline-item color="red" small icon="mdi-moped" fill-dot>
              <v-row dense>
                <v-col cols="3">
                  <strong>
                    {{ formatTime(status.timestamp) }}
                  </strong>
                </v-col>
                <v-col>
                  <strong>O kit médico foi enviado</strong>
                  <div class="caption">
                    {{ status.doctorMessage }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-expand-transition>

          <v-expand-transition v-if="status.receivedAt">
            <v-timeline-item color="yellow" small fill-dot>
              <template v-slot:icon>
                <v-icon small>mdi-cube-send</v-icon>
              </template>
              <v-row dense>
                <v-col cols="3">
                  <strong>{{ formatTime(status.receivedAt) }}</strong>
                </v-col>
                <v-col>
                  <strong>O paciente recebeu o kit</strong>
                  <div class="caption">
                    {{ status.receivedMessage }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-expand-transition>

          <v-expand-transition v-if="status.sentAt">
            <v-timeline-item color="green" small fill-dot>
              <template v-slot:icon>
                <v-icon dark small>mdi-moped mdi-flip-h</v-icon>
              </template>
              <v-row dense>
                <v-col cols="3" class="">
                  <strong>{{ formatTime(status.sentAt) }}</strong>
                </v-col>
                <v-col>
                  <strong>
                    O kit médico foi recolhido e está retornando para o barracão
                  </strong>
                  <div class="caption">
                    {{ status.sentMessage }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-expand-transition>
        </v-timeline>
      </v-card-text>
      <v-card-actions
        v-if="!status.receivedAt || !status.sentAt"
        class="justify-center"
      >
        <v-row justify="center">
          <v-col cols="12" sm="8">
            <v-textarea
              v-model="message"
              label="Deixar mensagem para o médico(opcional)"
              required
              autofocus
              counter
              rows="2"
            />
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn
              v-if="!status.receivedAt"
              :loading="isLoading"
              color="primary"
              @click="receiveKit"
            >
              Recebi o kit
            </v-btn>
            <v-btn
              v-else-if="!status.sentAt"
              :loading="isLoading"
              color="primary"
              @click="sentKit"
            >
              Enviei o kit de volta
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-row v-else>
        <v-col class="ma-2">
          <v-alert
            icon="mdi-information-outline"
            prominent
            text
            type="info"
            elevation="1"
          >
            Aguarde o médico encerrar seu atendimento
          </v-alert>
          <v-progress-linear
            color="blue lighten-2"
            buffer-value="0"
            height="6"
            stream
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import format from 'date-fns/format'
import { PATIENT_STATUS } from '../../constants'

export default {
  name: 'PatientWaitingKit',
  props: {
    patient: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    message: ''
  }),
  computed: {
    status() {
      return this.patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
    }
  },
  methods: {
    formatTime(timestamp) {
      return format(timestamp, 'h:mm a')
    },
    receiveKit() {
      this.isLoading = true
      return this.$api
        .setWaitingKitReceived(this.patient.ticket)
        .finally(() => (this.isLoading = false))
    },
    sentKit() {
      this.isLoading = true
      return this.$api
        .setWaitingKitSent(this.patient.ticket)
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
