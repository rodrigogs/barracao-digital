import Vue from 'vue';
import Vuex from 'vuex';
import patientSignUp from './patientSignUp';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({}),
  mutations: {},
  modules: {
    patientSignUp: {
      namespaced: true,
      state: patientSignUp.state,
      mutations: patientSignUp.mutations,
      actions: patientSignUp.actions,
    },
  },
});
