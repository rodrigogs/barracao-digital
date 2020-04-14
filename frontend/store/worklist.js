import Vue from 'vue'
import * as R from 'ramda'

export const state = () => ({
  patients: [],
  filters: {
    status: 'waiting',
    timeWaiting: null
  },
  lastEvaluatedKey: ''
})

export const getters = {
  getPatient: (state) => (paramTicket) =>
    state.patients.find(({ ticket }) => ticket === paramTicket)
}

export const actions = {
  fetchPatients({ commit, dispatch }, { filters = null }) {
    commit('setPatients', state().patients)
    commit('setFilters', filters)
    commit('setLastEvaluatedKey', '')
    return dispatch('fetchNextPatientsPage')
  },
  fetchNextPatientsPage({ commit, state }) {
    return this.$api
      .searchPatients(this.$auth.user.cep, {
        filters: state.filters,
        lastEvaluatedKey: state.lastEvaluatedKey
      })
      .then(
        ({ items, lastEvaluatedKey }) => {
          commit('appendPatients', items)
          commit('setLastEvaluatedKey', lastEvaluatedKey)
          return Promise.resolve({ items, lastEvaluatedKey })
        },
        (error) => Promise.reject(error)
      )
  },
  fetchPatient({ commit }, ticket) {
    return this.$api.searchPatientByTicket(ticket).then(
      (patient) => {
        commit('setPatient', patient)
        return Promise.resolve(patient)
      },
      (error) => Promise.reject(error)
    )
  },
  savePatientStatus({ commit }, { ticket, status, form }) {
    return this.$api
      .setPatientStatus(ticket, {
        status,
        form
      })
      .then(
        (patient) => {
          commit('setPatient', patient)
          return Promise.resolve(patient)
        },
        (error) => Promise.reject(error)
      )
  }
}

export const mutations = {
  setPatients(state, patients) {
    Vue.set(state, 'patients', patients)
  },
  appendPatients(state, patients) {
    Vue.set(state, 'patients', R.uniq([...state.patients, ...patients]))
  },
  setPatient(state, patient) {
    const index = state.patients.findIndex(({ id }) => id === patient.id)
    if (index === -1) state.patients.push(patient)
    else Vue.set(state.patients, index, patient)
  },
  setFilters(moduleState, filters) {
    if (!filters) Vue.set(moduleState, 'filters', state().filters)
    else Vue.set(moduleState, 'filters', filters)
  },
  setLastEvaluatedKey(state, lastEvaluatedKey = '') {
    Vue.set(state, 'lastEvaluatedKey', lastEvaluatedKey)
  }
}
