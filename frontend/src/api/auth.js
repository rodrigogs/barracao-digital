export default (request) => ({

  async login({ username, password }) {
    const { data } = await request.post('/auth/login', { username, password });
    return data;
  },

});
