export const get = (state) => (patientId) => state.list
  .find((patient) => patient.id === patientId);

export const list = (state) => state.list;

export const filter = (state) => state.filter;

export const selectedPatient = (state) => state.selectedPatient;
