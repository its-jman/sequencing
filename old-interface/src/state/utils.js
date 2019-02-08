export const getSelection = (state) => {
  let selection = state.selection.active;
  if (selection !== "") {
    selection = [selection];
  } else {
    selection = state.selection.checked;
  }
  return selection;
};
