export const get = (state) => (patientId) => state.list
  .find((patient) => patient.id === patientId);

export const list = (state) => state.list;
