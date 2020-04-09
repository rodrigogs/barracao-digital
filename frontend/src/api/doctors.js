const handleError = (err) => {
  console.error(err);
  if (!err.response) throw err;
  throw new Error(err.response.data.message);
};

const normalize = ({ cep, ...rest }) => ({
  ...rest,
  cep: cep.replace('-', ''),
});

export default (request) => ({

  async create(doctor) {
    try {
      const { data } = await request.post('/doctors/', normalize(doctor));
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async update(username, updatedDoctor) {
    try {
      const { data } = await request.put(`/doctors/${username}`, normalize(updatedDoctor));
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

  async remove(username) {
    try {
      await request.delete(`/doctors/${username}`);
    } catch (err) {
      handleError(err);
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

  async getOneByUsername(username) {
    try {
      const { data } = await request.get(`/doctors/username/${username}`);
      return data;
    } catch (err) {
      return handleError(err);
    }
  },

});
