<template>
  <v-card elevation="0">
    <v-container>
      <component
        :is="patientStatusComponent.component"
        v-bind="patientStatusComponent.props"
      />
    </v-container>
  </v-card>
</template>

<script>
import { PATIENT_STATUS } from '@/constants'
import PatientWaiting from '@/components/patient/PatientWaiting.vue'
import PatientOngoing from '@/components/patient/PatientOngoing.vue'
import PatientFinished from '@/components/patient/PatientFinished.vue'
import PatientCantBeAssisted from '@/components/patient/PatientCantBeAssisted.vue'
import PatientFacilityNotAvailable from '@/components/patient/PatientFacilityNotAvailable.vue'

const searchPatientByTicket = async (api, ticket) => {
  const {
    name,
    createdAt,
    status,
    ongoingFeedback,
    finishedFeedback
  } = await api.searchPatientByTicket(ticket)
  return {
    patient: {
      name,
      createdAt,
      status,
      ongoingFeedback,
      finishedFeedback
    }
  }
}

export default {
  validate({ params }) {
    return !isNaN(Number(params.ticket))
  },
  async asyncData({ app, params, error }) {
    try {
      return await searchPatientByTicket(app.$api, params.ticket)
    } catch (e) {
      error({ message: 'Usuário Inexistente', statusCode: 404 })
    }
  },
  data: () => ({
    patient: {
      name: null,
      createdAt: null,
      status: null,
      ongoingFeedback: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null
      },
      waitingKitFeedback: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null
      },
      finishedFeedback: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        patientOutcome: null,
        patientFeedback: null
      }
    }
  }),
  computed: {
    patientStatusComponent() {
      return {
        [PATIENT_STATUS.WAITING]: () => ({
          component: PatientWaiting,
          props: {
            createdAt: this.patient.createdAt,
            ticket: Number(this.$route.params.ticket)
          }
        }),
        [PATIENT_STATUS.ONGOING]: () => ({
          component: PatientOngoing,
          props: {
            ...this.patient.ongoingFeedback
          }
        }),
        [PATIENT_STATUS.FINISHED]: () => ({
          component: PatientFinished,
          props: {
            ...this.patient.finishedFeedback,
            clicked: this.ratingClicked
          }
        }),
        [PATIENT_STATUS.CANT_BE_ASSISTED]: () => ({
          component: PatientCantBeAssisted,
          props: {
            name: this.patient.name
          }
        }),
        [PATIENT_STATUS.FACILITY_NOT_AVAILABLE]: () => ({
          component: PatientFacilityNotAvailable
        })
      }[this.patient.status]()
    }
  },
  mounted() {
    this.handleMessaging()
    this.handleStatusUpdate()
  },
  methods: {
    handleStatusUpdate() {
      this.$fireStore
        .collection('patients')
        .doc(this.$route.params.ticket)
        .onSnapshot((doc) => {
          if (!doc.data()) return
          setTimeout(() => this.reloadPacientData(), 5000)
        })
    },
    async handleMessaging() {
      try {
        await this.$fireMess.requestPermission()
        const currentToken = await this.$fireMess.getToken()
        await this._updatePatientMessagingToken(currentToken)
        this.$fireMess.onTokenRefresh(async () => {
          const updatedToken = await this.$fireMess.getToken()
          this._updatePatientMessagingToken(updatedToken)
        })
        this.$fireMess.onMessage((payload) => {
          this.patient = payload.data
        })
      } catch (_error) {}
    },
    _updatePatientMessagingToken(token) {
      return this.$api.setPatientMessagingToken(this.$route.params.ticket, {
        token
      })
    },
    async reloadPacientData() {
      try {
        const data = await searchPatientByTicket(
          this.$api,
          this.$route.params.ticket
        )
        this.patient = data.patient
        return data
      } catch (e) {
        this.$nuxt.error({ message: 'Usuário Inexistente', statusCode: 404 })
      }
    },
    ratingClicked(rating) {
      return this.$api
        .savePatientFeedback(this.$route.params.ticket, rating)
        .then(
          (patient) => {
            this.$toast.success('Sua avaliação foi enviada com sucesso.')
            this.patient = patient
          },
          (error) => {
            this.$toast.error(
              'Desculpe, ocorreu um erro, tente avaliar novamente mais tarde.'
            )
            return Promise.reject(error)
          }
        )
    }
  }
}
</script>
