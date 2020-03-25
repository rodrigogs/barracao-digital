export default {

  get(state) {
    return (username) => {
      state.list.find((doctor) => doctor.username === username);
    };
  },

  list(state) {
    return state.list;
  },

};
