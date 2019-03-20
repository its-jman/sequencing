import { IMatch, IUpload } from "src/state/models";
import { COLORS } from "src/constants";

export * from "./types";
export * from "./hooks";

export const isEmpty = (obj: object | any[] | string | undefined | null): boolean => {
  if (obj === null || obj === undefined || obj === "") {
    return true;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return true;
  } else {
    if (Object.keys(obj).length === 0) return true;
  }

  return false;
};

export const arrayToObject = <T extends { _id: string }>(inp: T[], key: keyof T = "_id") => {
  return inp.reduce((mapped: { [key: string]: T }, item: T) => {
    mapped[item._id] = item;
    return mapped;
  }, {});
};

export const range = (start: number, end: number): number[] => {
  if (start < end) [start, end] = [end, start];
  const len = end - start + 1;

  return new Array(len).fill(undefined).map((_, i) => start + i);
};

export const objectIdToDate = (objectId: string): Date => {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

export const timeout = <T>(fn: () => T, ms: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        const res: T = fn();
        resolve(res);
      } catch (e) {
        reject(e);
      }
    }, ms);
  });
};

export const getClassNames = (...names: Array<string | undefined | null>) => {
  return names.filter((name) => !!name).join(" ");
};

export const validateUpload = (upload: IUpload) => {
  const errs: string[] = [];
  if (isEmpty(upload.name)) {
    errs.push("Name can not be empty");
  }

  return errs;
};

export const getRandomColor = (): string => {
  const keys = Object.keys(COLORS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return COLORS[key];
};

export const groupOverlappingMatches = (matches: IMatch[]): IMatch[][] => {
  if (matches.length === 0) return [];

  const out = [];
  let matchSet = [matches[0]];
  let maxEnd = matches[0][1];
  for (let i = 0; i < matches.length - 1; i++) {
    const nxt = matches[i + 1];

    if (nxt[0] <= maxEnd) {
      maxEnd = nxt[1];
      matchSet.push(nxt);
    } else {
      maxEnd = nxt[1];
      out.push(matchSet);
      matchSet = [nxt];
    }
  }
  out.push(matchSet);

  return out;
};
