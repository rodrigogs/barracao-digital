import * as api from '@/api';

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

export const selectPatient = async ({ commit, getters }, { ticket }) => {
  const patient = getters.list.find((p) => p.ticket === ticket);
  return commit('selectPatient', patient);
};

export const updateSelectedPatientStatus = async ({ getters }, { status }) => {
  const { ticket } = getters.selectedPatient;
  await api.patients.update({
    ticket,
    patient: {
      status,
    },
  });
};

export const updateFilter = async ({ commit, dispatch }, { status, timeWaiting }) => {
  commit('updateFilter', { status, timeWaiting });
  dispatch('refreshList');
};
