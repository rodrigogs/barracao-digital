export const fillList = (state, doctors) => {
  state.list = [...doctors];
};

export const updateList = (state, doctor) => {
  const listItem = state.list.find((listDoc) => listDoc.username === doctor.username);
  if (!listItem) {
    return state.list.unshift(doctor);
  }
  const itemIndex = state.list.indexOf(listItem);
  if (itemIndex === -1) {
    state.list.unshift(doctor);
  } else {
    state.list[itemIndex] = { ...doctor };
  }
};

export const removeFromList = (state, username) => {
  const listItem = state.list.find((listDoc) => listDoc.username === username);
  if (!listItem) return;
  const itemIndex = state.list.indexOf(listItem);
  if (itemIndex === -1) return;
  state.list.splice(itemIndex, 1);
};
