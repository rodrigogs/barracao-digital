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
  // Doctors
  getDoctorByUsername: (username) => axios.$get(`doctors/username/${username}`),
  getDoctorsByCep: (cep) => axios.$get(`doctors/cep/${cep}`),
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
