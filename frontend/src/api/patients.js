export default (request) => ({
  async signUpPatient({ patient }) {
    const { data } = await request.post('/patients', patient);
    return data;
  },
  async getPatientByTicket({ ticket }) {
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
