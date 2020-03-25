export const isLoggedIn = (state, getters) => !!getters.loggedUser;

export const loggedUser = (state) => {
  if (state.loggedUser) return state.loggedUser;
  const storedUser = localStorage.getItem('loggedUser');
  if (storedUser) return JSON.parse(storedUser);
  return null;
};
