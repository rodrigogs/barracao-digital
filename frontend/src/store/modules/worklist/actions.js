import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
export const refreshList = async ({ commit }) => {
  const patients = await api.patients.getList();
  return commit('fillList', patients);
};

export const selectPatient = async ({ commit, getters }, patientId) => {
  const patient = getters.get(patientId);
  return commit('selectPatient', patient);
};
