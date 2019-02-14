export const getClassNames = (...names: Array<string | undefined | null>) => {
  return names.filter((name) => !!name).join(" ");
};
