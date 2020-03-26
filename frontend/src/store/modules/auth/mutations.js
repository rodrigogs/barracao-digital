import Vue from 'vue';

export const updateLoggedUser = (state, loggedUser) => {
  localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  Vue.set(state, 'loggedUser', loggedUser);
};

export const loggedOut = (state) => {
  localStorage.removeItem('loggedUser');
  Vue.set(state, 'loggedUser', null);
};
