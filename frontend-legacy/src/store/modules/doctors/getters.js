export const get = (state) => (username) => state.list
  .find((doctor) => doctor.username === username);

export const list = (state) => state.list;
