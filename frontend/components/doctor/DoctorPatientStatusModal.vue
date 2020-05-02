<template>
  <v-dialog :value="patient" max-width="800" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="headline align-start">
        <div>#{{ patient.ticket }}</div>

        <v-spacer />

        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-title>
        <StatusBadge :status="patient.status" />

        <v-spacer />

        <v-list class="py-0" dense>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ timeWaiting }}</v-list-item-title>
              <v-list-item-subtitle>Tempo de espera</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-title>

      <v-card-text>
        <DoctorPatientStatusModalSummary :patient="patient" />

        <v-stepper
          v-if="!isUnassisted && !isFinishedStatus"
          v-model="step"
          vertical
        >
          <v-stepper-step
            :step="statusesIndex[PATIENT_STATUS.WAITING]"
            :complete="step > statusesIndex[PATIENT_STATUS.WAITING]"
          >
            <span class="title">Aguardando</span>
          </v-stepper-step>
          <v-stepper-content :step="statusesIndex[PATIENT_STATUS.WAITING]">
            <p>
              O paciente está aguardando atendimento, se deseja atendê-lo,
              continue para o próximo passo
            </p>
            <v-btn
              color="primary"
              @click.native="step = statusesIndex[PATIENT_STATUS.ONGOING]"
            >
              Próximo
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :step="statusesIndex[PATIENT_STATUS.ONGOING]"
            :complete="step > statusesIndex[PATIENT_STATUS.ONGOING]"
          >
            <span class="title">Em andamento</span>
          </v-stepper-step>
          <v-stepper-content :step="statusesIndex[PATIENT_STATUS.ONGOING]">
            <v-form @keydown.enter.prevent="validateOnGoingSection">
              <v-textarea
                v-model="$v.onGoing.message.$model"
                :error-messages="onGoingMessageErrors"
                label="Mensagem para o paciente*"
                required
                autofocus
                counter
              />

              <v-row>
                <v-col cols="12" class="text-center">
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="secondary"
                        class="ma-1"
                        :loading="isLoading"
                        :disabled="isLoading"
                        v-on="on"
                        @click="validateOnGoingSection"
                      >
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </template>
                    <span>Enviar mensagem para o paciente</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-if="isOngoing"
                        color="primary"
                        class="ma-1"
                        :loading="isLoadingSession"
                        :disabled="isLoadingSession"
                        v-on="on"
                        @click="startOpentokSession"
                      >
                        <v-icon>mdi-video</v-icon>
                      </v-btn>
                    </template>
                    <span>Iniciar chamade de vídeo com o paciente</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>

          <v-stepper-step
            :step="statusesIndex[PATIENT_STATUS.FINISHED]"
            :complete="statusIndex === statusesIndex[PATIENT_STATUS.FINISHED]"
            editable
          >
            <span class="title">Finalizado</span>
          </v-stepper-step>
          <v-stepper-content :step="statusesIndex[PATIENT_STATUS.FINISHED]">
            <form @keydown.enter.prevent="validateFinishedSection">
              <v-textarea
                v-model="finished.message"
                label="Mensagem para o paciente"
                autofocus
              />

              <v-select
                v-model="$v.finished.outcome.$model"
                :error-messages="finishedOutcomeErrors"
                :items="patientOutcomeItems"
                label="Desfecho do paciente*"
                required
              />

              <v-btn
                class="mt-4"
                :loading="isLoading"
                :disabled="isLoading"
                @click="step = statusesIndex[PATIENT_STATUS.ONGOING]"
              >
                Voltar
              </v-btn>

              <v-btn
                class="mt-4"
                color="primary"
                :loading="isLoading"
                :disabled="isLoading"
                @click="validateFinishedSection"
              >
                Finalizar
              </v-btn>
            </form>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { PATIENT_STATUS, PATIENT_OUTCOMES } from '~/constants'
import calculateTimeWaiting from '~/utils/calculateTimeWaiting'
import StatusBadge from '~/components/StatusBadge'
import DoctorPatientStatusModalSummary from '~/components/doctor/DoctorPatientStatusModalSummary'

export default {
  name: 'DoctorPatientStatusModal',
  components: {
    DoctorPatientStatusModalSummary,
    StatusBadge
  },
  props: {
    patient: {
      type: Object,
      required: true
    },
    save: {
      type: Function,
      required: true
    },
    startSession: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    step: 1,
    isLoading: false,
    isLoadingSession: false,
    fab: false,
    onGoing: {
      message: ''
    },
    finished: {
      message: '',
      outcome: ''
    }
  }),
  validations: {
    onGoing: {
      message: {
        required,
        minLength: minLength(10)
      }
    },
    finished: {
      outcome: {
        required
      }
    }
  },
  computed: {
    PATIENT_STATUS() {
      return PATIENT_STATUS
    },
    isUnassisted() {
      return this.patient.status === PATIENT_STATUS.CANT_BE_ASSISTED
    },
    isOngoing() {
      return this.patient.status === PATIENT_STATUS.ONGOING
    },
    isFinishedStatus() {
      const finishedStatuses = [
        PATIENT_STATUS.FINISHED,
        PATIENT_STATUS.FACILITY_NOT_AVAILABLE,
        PATIENT_STATUS.GAVE_UP
      ]
      return finishedStatuses.includes(this.patient.status)
    },
    statusesIndex() {
      return {
        [PATIENT_STATUS.WAITING]: 1,
        [PATIENT_STATUS.ONGOING]: 2,
        [PATIENT_STATUS.WAITING_KIT]: 4,
        [PATIENT_STATUS.FINISHED]: 3
      }
    },
    patientOutcomeItems() {
      return [
        {
          text: 'Caso suspeito isolamento domiciliar',
          value: PATIENT_OUTCOMES.SUSPECT_CASE_HOME_ISOLATION
        },
        {
          text: 'Caso suspeito referenciado',
          value: PATIENT_OUTCOMES.SUSPECT_CASE_REFERENCED
        },
        {
          text: 'Caso sem suspeita',
          value: PATIENT_OUTCOMES.NON_SUSPECT_CASE
        },
        {
          text: 'Caso sem suspeita referenciado',
          value: PATIENT_OUTCOMES.NON_SUSPECT_CASE_REFERENCED
        }
      ]
    },
    timeWaiting() {
      const ongoingStatus = this.patient[`${PATIENT_STATUS.ONGOING}Status`]

      if (ongoingStatus) {
        return calculateTimeWaiting(
          this.patient.createdAt,
          ongoingStatus.timestamp
        )
      }

      return calculateTimeWaiting(this.patient.createdAt, Date.now())
    },
    statusIndex() {
      return this.statusesIndex[this.patient.status]
    },
    onGoingMessageErrors() {
      const errors = []
      if (!this.$v.onGoing.message.$dirty) return errors
      !this.$v.onGoing.message.required &&
        errors.push('Por favor, digite uma mensagem para o paciente.')
      !this.$v.onGoing.message.minLength &&
        errors.push('O feedback deve ter mais de 10 caracteres')
      return errors
    },
    finishedOutcomeErrors() {
      const errors = []
      if (!this.$v.finished.outcome.$dirty) return errors
      !this.$v.finished.outcome.required &&
        errors.push('Por favor, seleciome um desfecho para o paciente.')
      return errors
    }
  },
  mounted() {
    this.step = this.statusesIndex[this.patient.status]
    this.onGoing.message =
      this.patient.ongoingStatus && this.patient.ongoingStatus.doctorMessage
    this.finished.message =
      this.patient.finishedStatus && this.patient.finishedStatus.doctorMessage
    this.finished.outcome =
      this.patient.finishedStatus && this.patient.finishedStatus.patientOutcome
  },
  methods: {
    startOpentokSession() {
      this.isLoadingSession = true
      this.startSession()
        .catch((err) => {
          this.$toast.error(err.response && err.response.data.message)
        })
        .finally(() => {
          this.isLoadingSession = false
        })
    },
    validateAndContinueOnGoingSection() {
      this.validateOnGoingSection().then(
        () => {
          this.step = this.statusesIndex[PATIENT_STATUS.FINISHED]
        },
        () => {}
      )
    },
    async validateOnGoingSection() {
      this.$v.onGoing.$touch()
      if (this.$v.onGoing.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true
      return await this.save({
        status: PATIENT_STATUS.ONGOING,
        form: {
          ...this.onGoing
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    async validateFinishedSection() {
      this.$v.finished.$touch()
      if (this.$v.finished.$invalid) {
        return this.$toast.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true
      return await this.save({
        status: PATIENT_STATUS.FINISHED,
        form: {
          ...this.finished
        }
      }).finally(() => {
        this.isLoading = false
        this.$emit('close')
      })
    }
  }
}
</script>
