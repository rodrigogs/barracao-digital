import { patients as patientsApi } from '@/api';

export const setStepFields = async ({ commit }, stepFields) => {
  commit('setStepFields', stepFields);
};

export const signUpPatient = async ({ commit, getters }) => {
  const patient = await patientsApi.signUpPatient(getters.getPatientToSignUp);
  commit('clearForm');
  return patient;
};

export const loginPatient = async ({ commit }, patient) => {
  commit('setLoggedInPatient', patient);
};

export const logoutPatient = async ({ commit }) => {
  commit('setLoggedOutPatient');
};
