import Vue from 'vue'

const getMessagesQuery = (app) => (originCep, doctorUsername, patientTicket) =>
  app.$fireStore
    .collection('facilities')
    .doc(originCep)
    .collection('conversations')
    .doc(`${doctorUsername}#${patientTicket}`)
    .collection('messages')

export const state = () => ({
  ready: false,
  messages: [],
  subscription: null
})

export const getters = {
  isReady: (state) => state.ready,
  getMessages: (state) => {
    const messages = [...state.messages]
    messages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    return messages
  }
}

export const actions = {
  startConversation(
    { dispatch },
    { originCep, doctorUsername, patientTicket, text, video }
  ) {
    return this.$api
      .createConversationSession(patientTicket, { text, video })
      .then(
        () =>
          text &&
          dispatch('subscribeToMessages', {
            originCep,
            doctorUsername,
            patientTicket
          })
      )
  },
  deleteConversation({ commit }, { patientTicket, text, video }) {
    return this.$api
      .deleteConversationSession(patientTicket, { text, video })
      .then(() => {
        if (text) {
          commit('clearMessages')
          commit('setReady', false)
        }
      })
  },
  subscribeToMessages(
    { commit, getters },
    { originCep, doctorUsername, patientTicket }
  ) {
    commit('setReady', false)
    commit('clearMessages')
    const subscription = getMessagesQuery(this)(
      originCep,
      doctorUsername,
      patientTicket
    ).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const message = change.doc.data()
        const index = getters.getMessages.findIndex(
          ({ timestamp }) => message.timestamp === timestamp
        )
        if (change.type === 'added') {
          commit('addMessage', message)
        }
        if (change.type === 'modified') {
          commit('modifyMessage', index, message)
        }
        if (change.type === 'removed') {
          commit('removeMessage', index)
        }
      })
      if (!getters.isReady) commit('setReady', true)
    })
    commit('setSubscription', subscription)
  },
  sendMessage(
    { commit },
    { from, originCep, doctorUsername, patientTicket, text }
  ) {
    const message = {
      from,
      patient: patientTicket,
      doctor: doctorUsername,
      timestamp: Date.now(),
      text
    }
    return getMessagesQuery(this)(originCep, doctorUsername, patientTicket)
      .doc(String(message.timestamp))
      .set(message)
  }
}

export const mutations = {
  setReady(state, value) {
    Vue.set(state, 'ready', !!value)
  },
  clearMessages(state) {
    state.subscription && state.subscription()
    Vue.delete(state, 'subscription')
    Vue.set(state, 'messages', [])
  },
  setSubscription(state, subscription) {
    Vue.set(state, 'subscription', subscription)
  },
  addMessage(state, message) {
    state.messages.push(message)
  },
  modifyMessage(state, index, message) {
    state.messages.splice(index, 1, message)
  },
  removeMessage(state, index) {
    state.messages.splice(index, 1)
  }
}
