import * as api from '@/api';

export const login = async ({ commit }, { username, password }) => {
  const loggedUser = await api.auth.login({ username, password });
  return commit('updateLoggedUser', loggedUser);
};

export const logou = async ({ commit }) => commit('loggedOut');
