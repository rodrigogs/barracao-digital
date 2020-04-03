import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import defaultState from './default-state';

const state = {
  ...defaultState,
  loggedInPatient: null,
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
