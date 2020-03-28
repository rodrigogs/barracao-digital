import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
export const refreshList = async ({ commit }, cep) => {
  const patients = await api.patients.getList({ cep });
  console.log(patients);
  return commit('fillList', patients);
};

export const selectPatient = async ({ commit, getters }, patientId) => {
  const patient = getters.get(patientId);
  return commit('selectPatient', patient);
};
