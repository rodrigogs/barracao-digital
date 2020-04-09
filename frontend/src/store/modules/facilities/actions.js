import * as api from '@/api';

export const refreshList = async ({ commit }) => {
  const facilities = await api.facilities.getList();
  commit('fillList', facilities);
};

export const getOriginDestinations = async (_, origin) => {
  return api.facilities.getDestinationsByOrigin(origin);
};

export const get = async (_, origin) => api.facilities.getByOrigin(origin);

export const getDestinations = async (_, origin) => api.facilities.getDestinationsByOrigin(origin);

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
  return api.facilities.update(facility.origin, facility);
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
