const handleError = (err) => {
  console.error(err);
  if (!err.response) throw err;
  throw new Error(err.response.data.message);
};

export default (request) => ({

  async create(facilitie) {
    try {
      const { data } = await request.post('/facilities', facilitie);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async update({ origin, facilitie }) {
    try {
      const { data } = await request.put(`/facilities/${origin}`, {
        ...facilitie,
        destinations: [],
      });
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async remove(origin) {
    try {
      await request.delete(`/facilities/${origin}`);
    } catch (err) {
      handleError(err);
    }
  },

  async addDestinations({ origin, destinations }) {
    try {
      const { data } = await request.put(`/facilities/${origin}`, { destinations });
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async getList() {
    try {
      const { data } = await request.get('/facilities');
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async getByOrigin(origin) {
    try {
      const { data } = await request.get(`/facilities/origin/${origin}`);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async getDestinationsByOrigin({ origin }) {
    try {
      const { data } = await request.get(`/facilities/origin/${origin}/destinations`);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },
});
