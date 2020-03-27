export default (request) => ({

  async update(doctor) {
    await request.post(`/doctors/${doctor.username}`, doctor);
  },

  async getList({ cep }) {
    const { data } = await request.get(`/doctors/cep/${cep}`);
    return data;
  },

});
