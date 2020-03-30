export default (request) => ({

  async create(facilitie) {
    const { data } = await request.post('/facilities', facilitie);
    return data;
  },

  async getList({ cep }) {
    const { data } = await request.get(`/facilities/cep/${cep}`);
    return data;
  },

});
