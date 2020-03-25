import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import defaultState from './default-state';

export default {
  namespaced: true,
  state: { ...defaultState },
  actions,
  getters,
  mutations,
};
