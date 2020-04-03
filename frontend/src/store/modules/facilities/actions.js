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

export const createDestination = async ({ dispatch }, { origin, destination }) => {
  await api.facilities.createDestination({
    origin,
    destination,
  });
  dispatch('refreshListDestinations', origin);
};

export const getByOrigin = async (store, origin) => await api.facilities.getByOrigin(origin);

export const update = async (store, facilitie) => {
  await api.facilities.update(facilitie);
};
