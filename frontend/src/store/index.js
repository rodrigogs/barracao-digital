import Vue from 'vue';
import Vuex from 'vuex';
import pacientSignUp from './pacientSignUp';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({}),
  mutations: {},
  modules: {
    pacientSignUp: {
      namespaced: true,
      state: pacientSignUp.state,
      mutations: pacientSignUp.mutations,
      actions: pacientSignUp.actions,
    },
  },
});
