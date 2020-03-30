export default (request) => ({

  async create(facilitie) {
    const { data } = await request.post('/facilities', facilitie);
    return data;
  },

  async update({ origin, facilitie }) {
    const { data } = await request.put(`/facilities/${origin}`, {
      ...facilitie,
      destinations: [],
    });
    return data;
  },

  async createDestination({ origin, destination }) {
    const { data } = await request.put(`/facilities/${origin}`, { destinations: [destination] });
    return data;
  },

  async getList() {
    const { data } = await request.get('/facilities');
    return data;
  },

  async getByOrigin(origin) {
    const { data } = await request.get(`/facilities/origin/${origin}`);
    return data;
  },

  async getDestinationsByOrigin({ origin }) {
    const { data } = await request.get(`/facilities/origin/${origin}/destinations`);
    return data;
  },
});
