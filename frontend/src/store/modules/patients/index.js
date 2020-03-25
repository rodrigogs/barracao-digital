import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import defaultState from './default-state';

export default {
  namespaced: true,
  state: { ...defaultState },
  actions,
  getters,
  mutations,
};
