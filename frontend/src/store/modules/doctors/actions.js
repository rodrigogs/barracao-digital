import * as api from '@/api';

export const refreshList = async ({ commit }, { cep }) => {
  const doctors = await api.doctors.getList({ cep });
  return commit('fillList', doctors);
};

export const updateDoctor = async ({ commit }, doctor) => {
  await api.doctors.update(doctor);
};
