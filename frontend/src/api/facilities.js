export default (request) => ({

  async create(facilitie) {
    const { data } = await request.post('/facilities', facilitie);
    return data;
  },

  async getList() {
    const { data } = await request.get('/facilities');
    return data;
  },

  async getDestinationsByOrigin({ origin }) {
    const { data } = await request.get(`/facilities/origin/${origin}/destinations`);
    return data;
  },
});
