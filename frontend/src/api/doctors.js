const handleError = (err) => {
  console.error(err);
  if (!err.response) throw err;
  throw new Error(err.response.data.message);
};

export default (request) => ({

  async create(doctor) {
    try {
      const { data } = await request.post('/doctors/', doctor);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async alternate() {
    try {
      const { data } = await request.post('/doctors/alternate');
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async getList({ cep }) {
    try {
      const { data } = await request.get(`/doctors/cep/${cep}`);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

});
