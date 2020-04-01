import { patients as patientsApi } from '@/api';

export const setStepFields = async ({ commit }, stepFields) => {
  commit('setStepFields', stepFields);
};

export const signUpPatient = ({ commit, getters }) => {
  patientsApi.signUpPatient(getters.getPatientToSignUp)
    .then((data) => {
      commit('clearForm');
      return Promise.resolve(data);
    },
    (error) => Promise.reject(error));
};
