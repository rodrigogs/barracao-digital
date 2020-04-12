// eslint-disable-next-line import/prefer-default-export
export const fillList = (state, patients) => {
  state.list = [...patients];
};

export const selectPatient = (state, patient) => {
  state.selectedPatient = patient;
};

export const updateFilter = (state, filter) => {
  state.filter = { ...state.filter, ...filter };
};
