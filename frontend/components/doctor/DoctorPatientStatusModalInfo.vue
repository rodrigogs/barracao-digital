<template>
  <v-card>
    <v-card-title class="headline align-start">
      <div>#{{ patient.ticket }}</div>

      <v-spacer></v-spacer>

      <StatusBadge :status="patient.status" />

      <v-spacer></v-spacer>

      <v-list class="py-0" dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-clock</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ timeWaiting }}</v-list-item-title>
            <v-list-item-subtitle>
              Tempo de espera
            </v-list-item-subtitle>
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
          :rules="[
            () =>
              step !== statusesIndex[PATIENT_STATUS.ONGOING] ||
              !!patient[`${PATIENT_STATUS.ONGOING}Status`] ||
              ($v.onGoing.$touch() && !$v.onGoing.$invalid),
          ]"
        >
          <span class="title">Em andamento</span>
        </v-stepper-step>
        <v-stepper-content :step="statusesIndex[PATIENT_STATUS.ONGOING]">
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-btn
                  v-if="!patient.textSession"
                  color="primary"
                  :loading="isLoading"
                  @click="validateOnGoingSection"
                >
                  Iniciar atendimento
                  <v-icon right>mdi-file-document-edit</v-icon>
                </v-btn>
                <div v-else>
                  <v-btn
                    color="primary"
                    :loading="isLoading"
                    @click="openConversation"
                  >
                    Abrir conversa <v-icon right>mdi-chat</v-icon>
                  </v-btn>
                  <v-btn
                    color="warning"
                    :loading="isLoading"
                    @click="step = statusesIndex[PATIENT_STATUS.WAITING_KIT]"
                  >
                    Enviar kit <v-icon right>mdi-medical-bag</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    :loading="isLoading"
                    @click="step = statusesIndex[PATIENT_STATUS.FINISHED]"
                  >
                    Finalizar
                    <v-icon right>mdi-exit-run</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>

        <v-stepper-step
          :step="statusesIndex[PATIENT_STATUS.WAITING_KIT]"
          :complete="step > statusesIndex[PATIENT_STATUS.WAITING_KIT]"
          :editable="!!patient[`${PATIENT_STATUS.ONGOING}Status`]"
          :rules="[
            () =>
              step !== statusesIndex[PATIENT_STATUS.WAITING_KIT] ||
              !patient[`${PATIENT_STATUS.WAITING_KIT}Status`] ||
              isPatientKitComingBack,
          ]"
        >
          <span class="title">Kit médico</span>
        </v-stepper-step>
        <v-stepper-content :step="statusesIndex[PATIENT_STATUS.WAITING_KIT]">
          <v-timeline v-if="isWaitingKit" align-top dense>
            <v-expand-transition>
              <v-timeline-item color="red" small icon="mdi-moped" fill-dot>
                <v-row dense>
                  <v-col cols="3">
                    <strong>
                      {{
                        formatTime(
                          patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
                            .timestamp
                        )
                      }}
                    </strong>
                  </v-col>
                  <v-col>
                    <strong>O kit médico foi enviado</strong>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-expand-transition>

            <v-expand-transition>
              <v-timeline-item
                v-if="isPatientKitReceived"
                color="yellow"
                small
                fill-dot
              >
                <template v-slot:icon>
                  <v-icon small>mdi-cube-send</v-icon>
                </template>
                <v-row dense>
                  <v-col cols="3">
                    <strong>{{
                      formatTime(
                        patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
                          .receivedAt
                      )
                    }}</strong>
                  </v-col>
                  <v-col>
                    <strong>O paciente recebeu o kit</strong>
                    <div class="caption">
                      {{
                        patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
                          .receivedMessage
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-expand-transition>

            <v-expand-transition>
              <v-timeline-item
                v-if="isPatientKitComingBack"
                color="green"
                small
                fill-dot
              >
                <template v-slot:icon>
                  <v-icon dark small>mdi-moped mdi-flip-h</v-icon>
                </template>
                <v-row dense>
                  <v-col cols="3" class="">
                    <strong>{{
                      formatTime(
                        patient[`${PATIENT_STATUS.WAITING_KIT}Status`].sentAt
                      )
                    }}</strong>
                  </v-col>
                  <v-col>
                    <strong>
                      O kit médico foi recolhido e está retornando para o
                      barracão
                    </strong>
                    <div class="caption">
                      {{
                        patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
                          .sentMessage
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-expand-transition>
          </v-timeline>

          <v-form @keydown.enter.prevent="validateWaitingKitSection">
            <v-row>
              <v-col v-if="!isWaitingKit">
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="step = statusesIndex[PATIENT_STATUS.ONGOING]"
                >
                  Voltar
                </v-btn>

                <v-btn
                  color="error"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="step = statusesIndex[PATIENT_STATUS.FINISHED]"
                >
                  Não enviar
                </v-btn>

                <v-btn
                  color="primary"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="validateWaitingKitSection"
                >
                  Enviar kit
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>

        <v-stepper-step
          :step="statusesIndex[PATIENT_STATUS.FINISHED]"
          :complete="statusIndex === statusesIndex[PATIENT_STATUS.FINISHED]"
          :editable="
            !!patient[`${PATIENT_STATUS.ONGOING}Status`] &&
            (patient.status !== PATIENT_STATUS.WAITING_KIT ||
              isPatientKitComingBack)
          "
        >
          <span class="title">Finalizado</span>
        </v-stepper-step>
        <v-stepper-content :step="statusesIndex[PATIENT_STATUS.FINISHED]">
          <form @keydown.enter.prevent="validateFinishedSection">
            <v-textarea
              v-model="finished.message"
              label="Mensagem para o paciente"
              autofocus
              rows="3"
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
</template>

<script>
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import format from 'date-fns/format'
import { PATIENT_STATUS, PATIENT_OUTCOMES } from '~/constants'
import calculateTimeWaiting from '~/utils/calculateTimeWaiting'
import StatusBadge from '~/components/StatusBadge'
import DoctorPatientStatusModalSummary from '~/components/doctor/DoctorPatientStatusModalSummary'

export default {
  name: 'DoctorPatientStatusModalInfo',
  components: {
    DoctorPatientStatusModalSummary,
    StatusBadge,
  },
  props: {
    patient: {
      type: Object,
      required: true,
    },
    save: {
      type: Function,
      required: true,
    },
    openConversation: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    step: 1,
    tab: null,
    isLoading: false,
    isLoadingConversation: false,
    onGoing: {
      message: '',
    },
    waitingKit: {
      message:
        'Um kit médico com instruções de uso está sendo enviado para a sua localização. Por favor, certifique-se de que ele será recebido ao chegar no local.',
    },
    finished: {
      message: '',
      outcome: '',
    },
  }),
  validations: {
    onGoing: {},
    waitingKit: {},
    finished: {
      outcome: {
        required,
      },
    },
  },
  computed: {
    PATIENT_STATUS() {
      return PATIENT_STATUS
    },
    isUnassisted() {
      return this.patient.status === PATIENT_STATUS.CANT_BE_ASSISTED
    },
    isWaitingKit() {
      return this.patient.status === PATIENT_STATUS.WAITING_KIT
    },
    isFinishedStatus() {
      const finishedStatuses = [
        PATIENT_STATUS.FINISHED,
        PATIENT_STATUS.FACILITY_NOT_AVAILABLE,
        PATIENT_STATUS.GAVE_UP,
      ]
      return finishedStatuses.includes(this.patient.status)
    },
    statusesIndex() {
      return {
        [PATIENT_STATUS.WAITING]: 1,
        [PATIENT_STATUS.ONGOING]: 2,
        [PATIENT_STATUS.WAITING_KIT]: 3,
        [PATIENT_STATUS.FINISHED]: 4,
      }
    },
    patientOutcomeItems() {
      return [
        {
          text: 'Caso suspeito isolamento domiciliar',
          value: PATIENT_OUTCOMES.SUSPECT_CASE_HOME_ISOLATION,
        },
        {
          text: 'Caso suspeito referenciado',
          value: PATIENT_OUTCOMES.SUSPECT_CASE_REFERENCED,
        },
        {
          text: 'Caso sem suspeita',
          value: PATIENT_OUTCOMES.NON_SUSPECT_CASE,
        },
        {
          text: 'Caso sem suspeita referenciado',
          value: PATIENT_OUTCOMES.NON_SUSPECT_CASE_REFERENCED,
        },
        {
          text: 'Não atendido',
          value: PATIENT_OUTCOMES.NOT_ATTENDED,
        },
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
    isPatientKitReceived() {
      const waitingKitStatus = this.patient[
        `${PATIENT_STATUS.WAITING_KIT}Status`
      ]
      return waitingKitStatus && !!waitingKitStatus.receivedAt
    },
    isPatientKitComingBack() {
      const waitingKitStatus = this.patient[
        `${PATIENT_STATUS.WAITING_KIT}Status`
      ]
      return waitingKitStatus && !!waitingKitStatus.sentAt
    },
    onGoingMessageErrors() {
      const errors = []
      if (!this.$v.onGoing.message.$dirty) return errors
      return errors
    },
    waitingKitMessageErrors() {
      const errors = []
      if (!this.$v.waitingKit.message.$dirty) return errors
      return errors
    },
    finishedOutcomeErrors() {
      const errors = []
      if (!this.$v.finished.outcome.$dirty) return errors
      !this.$v.finished.outcome.required &&
        errors.push('Por favor, seleciome um desfecho para o paciente.')
      return errors
    },
  },
  mounted() {
    this.step = this.statusesIndex[this.patient.status]
    this.onGoing.message =
      this.patient[`${PATIENT_STATUS.ONGOING}Status`] &&
      this.patient[`${PATIENT_STATUS.ONGOING}Status`].doctorMessage
    this.waitingKit.message =
      (this.patient[`${PATIENT_STATUS.WAITING_KIT}Status`] &&
        this.patient[`${PATIENT_STATUS.WAITING_KIT}Status`].doctorMessage) ||
      this.waitingKit.message
    this.finished.message =
      this.patient[`${PATIENT_STATUS.FINISHED}Status`] &&
      this.patient[`${PATIENT_STATUS.FINISHED}Status`].doctorMessage
    this.finished.outcome =
      this.patient[`${PATIENT_STATUS.FINISHED}Status`] &&
      this.patient[`${PATIENT_STATUS.FINISHED}Status`].patientOutcome
  },
  methods: {
    ...mapActions('chat', ['informDoctorSentKit', 'deleteConversation']),
    formatTime(timestamp) {
      return format(timestamp, 'h:mm a')
    },
    async validateOnGoingSection() {
      this.$v.onGoing.$touch()
      if (this.$v.onGoing.$invalid) {
        return this.$noty.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true

      if (
        !(this.patient.keepAlive && this.patient.keepAlive > Date.now() - 22000)
      ) {
        await this.$api.sendSmsMessageToPatient(
          this.patient.ticket,
          this.patient
        )
      }

      await this._changeStatus(PATIENT_STATUS.ONGOING, {
        ...this.onGoing,
      })
        .then(() => this.openConversation())
        .finally(() => (this.isLoading = false))
    },
    async validateFinishedSection() {
      this.$v.finished.$touch()
      if (this.$v.finished.$invalid) {
        return this.$noty.error(
          'Existem erros no formulário, revise-os antes de seguir.'
        )
      }

      this.isLoading = true

      await this.deleteConversation({
        originCep: this.$auth.user.cep,
        doctorUsername: this.$auth.user.username,
        patientTicket: this.patient.ticket,
      })

      return await this._changeStatus(PATIENT_STATUS.FINISHED, {
        ...this.finished,
      }).finally(() => (this.isLoading = false))
    },
    async validateWaitingKitSection() {
      if (
        !(await this.$dialog.confirm({ text: 'Você confirma o envio do kit?' }))
      )
        return

      window.open('https://airtable.com/shrGTP8pBOYCeY7Kd', '_blank')

      this.isLoading = true
      return await this._changeStatus(PATIENT_STATUS.WAITING_KIT, {
        ...this.waitingKit,
      })
        .then(() =>
          this.informDoctorSentKit({
            originCep: this.$auth.user.cep,
            doctorUsername: this.$auth.user.username,
            patientTicket: this.patient.ticket,
          })
        )
        .finally(() => (this.isLoading = false))
    },
    _changeStatus(status = PATIENT_STATUS.ONGOING, form = {}) {
      return this.save({
        status,
        form,
      }).catch((error) => {
        this.$noty.error(error.response.data.message)
      })
    },
  },
}
</script>
