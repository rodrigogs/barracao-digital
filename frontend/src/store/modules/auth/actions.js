import * as api from '@/api';

export default {

  async login({ commit }, { username, password }) {
    const { data } = await api.auth.login({ username, password });
  },

};
