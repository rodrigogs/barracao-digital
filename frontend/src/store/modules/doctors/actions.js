import * as api from '@/api';

export const refreshList = async ({ commit }, { cep }) => {
  const doctors = await api.doctors.getList({ cep });
  return commit('fillList', doctors);
};

export const alternate = async () => {
  await api.doctors.alternate();
};
