import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
export const refreshList = async ({ commit }, { cep }) => {
  const doctors = await api.doctors.getList({ cep });
  return commit('fillList', doctors);
};
