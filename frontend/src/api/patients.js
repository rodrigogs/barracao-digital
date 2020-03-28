const encodePatient = ({
  name = '',
  age = '',
  cep = '',
  meds = null,
  allergies = null,
  covenant = null,
  hasBeenAssisted = false,
  phone = '',
  email = null,
  whatsapp = null,
  telegram = null,
  hangout = null,
  skype = null,
  status = null,
} = {}) => ({
  name,
  age,
  cep,
  meds: meds || null,
  allergies: allergies || null,
  covenant: covenant || null,
  hasBeenAssisted,
  phone,
  email: email || null,
  whatsapp: whatsapp || null,
  telegram: telegram || null,
  hangout: hangout || null,
  skype: skype || null,
  status: status || null,
})

export default (request) => ({
  async signUpPatient(patient) {
    return request
      .post('/patients', encodePatient(patient))
      .then(({ data }) => data, (error) => Promise.reject(error));
  },
  async getPatientByTicket(ticket) {
    const { data } = await request.get(`/patients/ticket/${ticket}`);
    return data;
  },
  async update({ ticket, patient }) {
    await request.put(`/patients/${ticket}`, patient);
  },
  async getList({ cep, params }) {
    const { data } = await request.get(`/patients/cep/${cep}`, { params });
    return data;
  },
});
