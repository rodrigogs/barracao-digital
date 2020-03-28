import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
export const refreshList = async ({ commit }, cep) => {
  const patients = await api.patients.getList({ cep });
  return commit('fillList', patients);
};

export const selectPatient = async ({ commit }, ticket) => {
  const patient = await api.patients.getPatientByTicket({ ticket });
  return commit('selectPatient', patient);
};
