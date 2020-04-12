export const list = (state) => state.list;

export const getByOrigin = (state) => (origin) => state.list
  .find((facilitie) => facilitie.origin === origin);
