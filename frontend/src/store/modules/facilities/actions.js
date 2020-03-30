import * as api from '@/api';

export const refreshList = async ({ commit, dispatch }) => {
  const facilities = await api.facilities.getList();
  commit('fillList', facilities);
  setTimeout(() => facilities.forEach(({ origin }) => dispatch('refreshListDestinations', origin)), 2000)
};

export const refreshListDestinations = async ({ commit, getters, state }, origin) => {
  const destinations = await api.facilities.getDestinationsByOrigin({ origin });
  const facilitie = getters.getByOrigin(origin)
  facilitie.destinations = destinations || []
  commit('fillList', state.list);
};

export const create = async ({ commit }, {
  origin,
  contactType,
  contact,
}) => {
  await api.facilities.create({
    origin,
    contactType,
    contact,
  });
};
