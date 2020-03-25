import api from '../api';

const defaultState = {
  name: '',
  age: '',
  cep: '',
  meds: '',
  allergies: '',
  covenant: '',
  has_been_assisted: false,
  phone: '',
  email: '',
  whatsapp: '',
  telegram: '',
  hangout: '',
  skype: '',
};

export default {
  state: () => (defaultState),
  mutations: {
    setStepFields(state, stepFields) {
      state = { ...state, ...stepFields };
    },
    clearForm(state) {
      state = { ...defaultState };
    },
  },
  actions: {
    async savePatientSignUp({ state }) {
      try {
        const pacient = { ...state };
        const campaignSaved = await api.savePacient(pacient);

        return campaignSaved;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  getters: {

  },
};
