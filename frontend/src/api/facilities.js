const handleError = (err) => {
  console.error(err);
  if (!err.response) throw err;
  throw new Error(err.response.data.message);
};

const normalize = ({ origin, destinations, ...rest }) => ({
  ...rest,
  origin: origin.replace('-', ''),
  destinations: destinations || [],
});

export default (request) => ({

  async create(facilitie) {
    try {
      const { data } = await request.post('/facilities', normalize(facilitie));
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async update(origin, facility) {
    try {
      const { data } = await request.put(`/facilities/${origin.replace('-', '')}`, {
        ...normalize(facility),
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

  async getDestinationsByOrigin(origin) {
    try {
      const { data } = await request.get(`/facilities/origin/${origin}/destinations`);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },
});
