import * as api from '@/api';

export const get = async (_, username) => api.doctors.getOneByUsername(username);

export const create = async ({ commit }, doctor) => {
  const createdDoctor = await api.doctors.create(doctor);
  commit('updateList', createdDoctor);
  return createdDoctor;
};

export const update = async ({ commit }, doctor) => {
  const editedDoctor = await api.doctors.update(doctor.username, doctor);
  commit('updateList', editedDoctor);
  return editedDoctor;
};

export const remove = async ({ commit }, username) => {
  await api.doctors.remove(username);
  commit('removeFromList', username);
};

export const refreshList = async ({ commit }, { cep }) => {
  const doctors = await api.doctors.getList({ cep });
  commit('fillList', doctors);
  return doctors;
};

export const alternate = async ({ rootGetters, commit }) => {
  const loggedUser = rootGetters['auth/loggedUser'];
  const { active } = await api.doctors.alternate();
  commit('auth/updateLoggedUser', { ...loggedUser, active }, { root: true });
};
