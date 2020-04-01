export const fillList = (state, doctors) => {
  state.list = [...doctors];
};

export const addToList = (state, doctor) => {
  state.list.unshift(doctor);
};
