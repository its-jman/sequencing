export const makeAction = (type, ...argNames) => {
  return (...args) => {
    const action = { type };
    argNames.forEach((argName, index) => {
      action[argName] = args[index];
    });
    return action;
  };
};
