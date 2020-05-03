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
import PatientGaveUp from '@/components/patient/PatientGaveUp.vue'

const searchPatientByTicket = async (api, ticket) => {
  const {
    originCep,
    name,
    createdAt,
    status,
    ongoingStatus,
    finishedStatus,
    videoSession
  } = await api.searchPatientByTicket(ticket)
  return {
    patient: {
      ticket,
      originCep,
      name,
      createdAt,
      status,
      ongoingStatus,
      finishedStatus,
      videoSession
    }
  }
}

export default {
  layout: 'patients',
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
      [`${PATIENT_STATUS.ONGOING}Status`]: {
        originCep: null,
        patientTicket: null,
        doctorUsername: null,
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        timestamp: null
      },
      [`${PATIENT_STATUS.WAITING_KIT}Status`]: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        timestamp: null
      },
      [`${PATIENT_STATUS.FINISHED}Status`]: {
        doctorName: null,
        doctorCrm: null,
        doctorState: null,
        doctorMessage: null,
        facilityName: null,
        patientOutcome: null,
        patientFeedback: null,
        timestamp: null
      }
    },
    isVideoChatOpen: false,
    patientSubscription: null
  }),
  computed: {
    patientStatusComponent() {
      return {
        [PATIENT_STATUS.WAITING]: () => ({
          component: PatientWaiting,
          props: {
            createdAt: this.patient.createdAt,
            ticket: this.$route.params.ticket
          }
        }),
        [PATIENT_STATUS.ONGOING]: () => ({
          component: PatientOngoing,
          props: {
            ...this.patient[`${PATIENT_STATUS.ONGOING}Status`],
            patient: this.patient,
            videoSession: this.patient.videoSession || {}
          }
        }),
        [PATIENT_STATUS.WAITING_KIT]: () => ({
          component: PatientOngoing,
          props: {
            ...this.patient[`${PATIENT_STATUS.WAITING_KIT}Status`]
            // TODO
          }
        }),
        [PATIENT_STATUS.FINISHED]: () => ({
          component: PatientFinished,
          props: {
            ...this.patient[`${PATIENT_STATUS.FINISHED}Status`],
            clicked: this.ratingClicked
          }
        }),
        [PATIENT_STATUS.CANT_BE_ASSISTED]: () => ({
          component: PatientCantBeAssisted,
          props: {
            name: this.patient.name,
            ticket: this.$route.params.ticket
          }
        }),
        [PATIENT_STATUS.FACILITY_NOT_AVAILABLE]: () => ({
          component: PatientFacilityNotAvailable
        }),
        [PATIENT_STATUS.GAVE_UP]: () => ({
          component: PatientGaveUp
        })
      }[this.patient.status]()
    }
  },
  mounted() {
    this.handleMessaging()
    this.handleUpdates()
  },
  beforeDestroy() {
    if (this.patientSubscription) this.patientSubscription() // Unsubscribes
  },
  methods: {
    handleUpdates() {
      if (this.patientSubscription) this.patientSubscription()
      this.patientSubscription = this.$fireStore
        .collection('facilities')
        .doc(this.patient.originCep)
        .collection('patients')
        .doc(this.patient.ticket)
        .onSnapshot((doc) => {
          this.$set(this, 'patient', doc.data())
        })
    },
    async handleMessaging() {
      try {
        const currentToken = await this.$fireMess.getToken()
        await this._updatePatientMessagingToken(currentToken)
        this.$fireMess.onTokenRefresh(async () => {
          const updatedToken = await this.$fireMess.getToken()
          this._updatePatientMessagingToken(updatedToken)
        })
      } catch (_error) {}
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
    },
    _updatePatientMessagingToken(token) {
      return this.$api.setPatientMessagingToken(this.$route.params.ticket, {
        token
      })
    }
  }
}
</script>
