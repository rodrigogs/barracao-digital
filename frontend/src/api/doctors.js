export default (request) => ({

  async alternate() {
    const { data } = await request.post('/doctors/alternate');
    return data;
  },

  async getList({ cep }) {
    const { data } = await request.get(`/doctors/cep/${cep}`);
    return data;
  },

});
