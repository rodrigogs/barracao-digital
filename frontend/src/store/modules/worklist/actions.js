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

export const updateSelectedPatientStatus = async ({ getters, dispatch }, { status, message }) => {
  const { ticket } = getters.selectedPatient;
  let updatedPatient;
  if (status === 'ongoing') {
    updatedPatient = await api.patients.setOngoing({ ticket, message });
  } else if (status === 'waiting_kit') {
    updatedPatient = await api.patients.setWaitingKit({ ticket, message });
  } else if (status === 'finished') {
    updatedPatient = await api.patients.setFinished({ ticket, message });
  } else if (updatedPatient) {
    await dispatch('refreshList');
  } else {
    throw new Error(`Invalid status "${status}"`);
  }
};

export const updateFilter = async ({ commit, dispatch }, { status, timeWaiting }) => {
  commit('updateFilter', { status, timeWaiting });
  return dispatch('refreshList');
};
