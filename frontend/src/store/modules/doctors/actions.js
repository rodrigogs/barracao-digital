import * as api from '@/api';

export default {

  async refreshList({ commit }, { cep }) {
    const doctors = await api.doctors.getList({ cep });
    return commit('fillList', doctors);
  },

};
