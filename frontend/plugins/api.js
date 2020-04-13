const apiFactory = (axios) => ({
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

  alternateDoctorStatus: () => axios.$post('doctors/alternate'),

  getAllFacilities: (lastEvaluatedKey = '') =>
    axios.$get('facilities', {
      params: {
        lastEvaluatedKey,
        pageSize: 20
      }
    }),
  deleteFacility: (origin) => axios.$delete(`facilities/${origin}`)
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
