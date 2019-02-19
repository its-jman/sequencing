export const isEmptyObject = (obj: Object | Array<any> | undefined | null): boolean => {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return true;
  } else {
    if (Object.keys(obj).length === 0) return true;
  }

  return false;
};
