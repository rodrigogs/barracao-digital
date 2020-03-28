import * as api from '@/api';

export const refreshList = async ({ commit }, { cep }) => {
  const doctors = await api.doctors.getList({ cep });
  return commit('fillList', doctors);
};

export const alternate = async ({ rootGetters, commit }) => {
  const loggedUser = rootGetters['auth/loggedUser'];
  const { active } = await api.doctors.alternate();
  commit('auth/updateLoggedUser', { ...loggedUser, active }, { root: true });
};
