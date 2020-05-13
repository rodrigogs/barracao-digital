const apiFactory = (axios) => ({
  // Patients
  searchPatientByTicket: (ticket) => axios.$get(`patients/ticket/${ticket}`),
  signUpPatient: (patient) => axios.$post('patients', patient),
  setPatientStatus: (ticket, { status, form = {} }) =>
    axios.$put(`patients/${ticket}/status/${status}`, form),
  savePatientFeedback: (ticket, value) =>
    axios.$put(`patients/${ticket}/feedback`, { value }),
  searchPatients: (cep, { filters, lastEvaluatedKey }) =>
    axios.$get(`patients/cep/${cep}`, {
      params: { ...filters, lastEvaluatedKey, pageSize: 20 }
    }),
  setPatientMessagingToken: (ticket, { token }) =>
    axios.$put(`patients/${ticket}/messaging/token`, { ticket, token }),
  setWaitingKitReceived: (ticket, { message }) =>
    axios.$put(`patients/${ticket}/status/received_kit`, { message }),
  setWaitingKitSent: (ticket, { message }) =>
    axios.$put(`patients/${ticket}/status/sent_kit`, { message }),
  // Doctors
  createConversationSession: (ticket, { text = false, video = false }) =>
    axios.$post(`doctors/conversation/${ticket}`, { text, video }),
  deleteConversationSession: (ticket, { text = false, video = false }) =>
    axios.$delete(`doctors/conversation/${ticket}`, { data: { text, video } }),
  createDoctor: (doctor) => axios.$post(`doctors`, doctor),
  updateDoctor: (username, doctor) => axios.$put(`doctors/${username}`, doctor),
  deleteDoctor: (username) => axios.$delete(`doctors/${username}`),
  getDoctorByUsername: (username) => axios.$get(`doctors/username/${username}`),
  getDoctors: ({ lastEvaluatedKey = '' } = {}) =>
    axios.$get('doctors', {
      params: {
        lastEvaluatedKey,
        pageSize: 20
      }
    }),
  getDoctorsByCep: (cep, { lastEvaluatedKey = '' } = {}) =>
    axios.$get(`doctors/cep/${cep}`, {
      params: {
        lastEvaluatedKey,
        pageSize: 20
      }
    }),
  alternateDoctorStatus: () => axios.$post('doctors/alternate'),
  // Facilities
  getAllFacilities: (lastEvaluatedKey = '') =>
    axios.$get('facilities', {
      params: {
        lastEvaluatedKey,
        pageSize: 20
      }
    }),
  createFacility: (facility) => axios.$post('facilities', facility),
  updateFacility: (origin, facility) =>
    axios.$put(`facilities/${origin}`, facility),
  deleteFacility: (origin) => axios.$delete(`facilities/${origin}`),
  deleteFacilityDestinations: (origin, { destinations }) =>
    axios.$delete(`facilities/${origin}/destinations`, {
      data: { destinations }
    }),
  getAllDestinationsByOrigin: (origin) =>
    axios.$get(`facilities/origin/${origin}/destinations`),
  checkFacilityAvailability: (origin) =>
    axios.$get(`facilities/origin/${origin}/check`)
})

/*
 ** Executed by ~/.nuxt/index.js with context given
 ** This method can be asynchronous
 */
export default ({ $axios }, inject) => {
  // Inject `api` key
  // -> app.$api
  // -> this.$api in vue components
  // -> this.$api in store actions/mutations
  const api = apiFactory($axios)
  inject('api', api)
}
