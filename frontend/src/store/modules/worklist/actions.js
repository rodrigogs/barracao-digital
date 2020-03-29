import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
export const refreshList = async ({
  getters,
  commit,
  rootGetters,
}) => {
  const loggedUser = rootGetters['auth/loggedUser'];
  const patients = await api.patients.getList({
    cep: loggedUser.cep,
    params: getters.filter,
  });
  return commit('fillList', patients);
};

export const selectPatient = async ({ commit }, { ticket }) => {
  const patient = await api.patients.getPatientByTicket({ ticket });
  return commit('selectPatient', patient);
};

export const updateFilter = async ({ commit, dispatch }, { status, entranceTime }) => {
  commit('updateFilter', { status, entranceTime });
  dispatch('refreshList');
};
