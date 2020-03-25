export default (request) => ({

  async checkLogin() {
    throw new Error('Not implemented');
  },

  async getList() {
    const { data } = await request.get('/doctors');
    return data;
  },

});
