export default (request) => ({

  async alternate() {
    await request.post('/doctors/alternate');
  },

  async getList({ cep }) {
    const { data } = await request.get(`/doctors/cep/${cep}`);
    return data;
  },

});
