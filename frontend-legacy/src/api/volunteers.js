const handleError = (err) => {
  console.error(err);
  if (!err.response) throw err;
  throw new Error(err.response.data.message);
};

export default (request) => ({

  async create(volunteer) {
    try {
      const { data } = await request.post('/volunteers', volunteer);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

});
