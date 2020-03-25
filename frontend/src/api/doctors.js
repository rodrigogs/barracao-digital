export default (request) => ({

  async getList({ cep }) {
    const { data } = await request.get(`/doctors/cep/${cep}`);
    return data;
  },

});
