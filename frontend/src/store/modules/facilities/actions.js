import * as api from '@/api';

export const refreshList = async ({ commit, dispatch }) => {
  const facilities = await api.facilities.getList();
  commit('fillList', facilities);
  facilities.forEach(({ origin }) => dispatch('refreshListDestinations', origin));
};

export const refreshListDestinations = async ({ commit, getters, state }, origin) => {
  const destinations = await api.facilities.getDestinationsByOrigin({ origin });
  const facilitie = getters.getByOrigin(origin);
  facilitie.destinations = destinations || [];
  commit('fillList', state.list);
};

export const create = async (_, {
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

export const update = async (_store, facility) => {
  await api.facilities.update(facility.origin, facility);
};

export const remove = async (_store, origin) => {
  await api.facilities.remove(origin);
};

export const addDestinations = async ({ dispatch }, { origin, destinations }) => {
  await api.facilities.addDestinations({
    origin,
    destinations,
  });
  dispatch('refreshListDestinations', origin);
};

export const getByOrigin = (_store, origin) => api.facilities.getByOrigin(origin);
