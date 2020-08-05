import Vue from 'vue'
import { removeUndefinedProps } from '../utils/objectUtils'

const getMessagesQuery = (app) => (originCep, doctorUsername, patientTicket) =>
  app.$fireStore
    .collection('facilities')
    .doc(originCep)
    .collection('conversations')
    .doc(`${patientTicket}`)
    .collection('messages')

export const state = () => ({
  ready: false,
  messages: [],
  subscription: null,
  receivedMessages: 0,
})

export const getters = {
  isReady: (state) => state.ready,
  getMessages: (state) => {
    const messages = [...state.messages]
    messages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    return messages
  },
  getReceivedMessages: (state) => state.receivedMessages,
}

export const actions = {
  readMessages({ commit }) {
    commit('resetReceivedMessages')
  },
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
            patientTicket,
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
          commit('incrementReceivedMessages')
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
    {
      type = 'default',
      icon,
      from,
      originCep,
      doctorUsername,
      patientTicket,
      text,
    }
  ) {
    const message = {
      type,
      icon,
      from,
      patient: patientTicket,
      doctor: doctorUsername,
      timestamp: Date.now(),
      text,
    }
    return getMessagesQuery(this)(originCep, doctorUsername, patientTicket)
      .doc(String(message.timestamp))
      .set(removeUndefinedProps(message))
  },
  informPatientCanceledVideo(
    { dispatch },
    { originCep, doctorUsername, patientTicket }
  ) {
    return dispatch('sendMessage', {
      type: 'info',
      icon: 'mdi-video-off',
      from: 'patient',
      originCep,
      doctorUsername,
      patientTicket,
      text: 'O paciente encerrou a chamada de vídeo',
    })
  },
  informDoctorCanceledVideo(
    { dispatch },
    { originCep, doctorUsername, patientTicket }
  ) {
    return dispatch('sendMessage', {
      type: 'info',
      icon: 'mdi-video-off',
      from: 'doctor',
      originCep,
      doctorUsername,
      patientTicket,
      text: 'O médico encerrou a chamada de vídeo',
    })
  },
  informDoctorSentKit(
    { dispatch },
    { originCep, doctorUsername, patientTicket }
  ) {
    return dispatch('sendMessage', {
      type: 'info',
      icon: 'mdi-moped',
      from: 'doctor',
      originCep,
      doctorUsername,
      patientTicket,
      text: 'O médico enviou um kit',
    })
  },
  informPatientReceivedKit(
    { dispatch },
    { originCep, doctorUsername, patientTicket }
  ) {
    return dispatch('sendMessage', {
      type: 'info',
      icon: 'mdi-cube-send',
      from: 'patient',
      originCep,
      doctorUsername,
      patientTicket,
      text: 'O paciente recebeu o kit',
    })
  },
  informPatientSentKitBack(
    { dispatch },
    { originCep, doctorUsername, patientTicket }
  ) {
    return dispatch('sendMessage', {
      type: 'info',
      icon: 'mdi-moped mdi-flip-h',
      from: 'patient',
      originCep,
      doctorUsername,
      patientTicket,
      text: 'O paciente enviou o kit de volta',
    })
  },
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
  },
  incrementReceivedMessages(state) {
    Vue.set(state, 'receivedMessages', state.receivedMessages + 1)
  },
  resetReceivedMessages(state) {
    Vue.set(state, 'receivedMessages', 0)
  },
}
