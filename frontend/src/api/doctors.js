export default (request) => ({

  async getList() {
    const { data } = await request.get('/doctors');
    return data;
  },

});
