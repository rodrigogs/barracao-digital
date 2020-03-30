import * as api from '@/api';

export const refreshList = async ({ commit }) => {
};

export const create = async ({ commit }, {
  origin,
  contactType,
  contact,
}) => {
  const facilitie = await api.facilities.create({
    origin,
    contactType,
    contact,
  });
};
