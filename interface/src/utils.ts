import React, { useEffect } from "react";
import { IDataset, IDatasetsState } from "src/state/models";

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

// TODO: Figure out the proper way to destroy and re-use this instead of passing in an empty array
export const useKeydownHandler = (keydownMap: { [keyCode: number]: () => void }) => {
  // console.log("REDOING");

  useEffect(() => {
    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode in keydownMap) {
        event.preventDefault();
        event.stopPropagation();
        keydownMap[event.keyCode]();
      }
    };
    // console.log("INNER REDO");
    // @ts-ignore
    document.addEventListener("keydown", handler, false);
    return () => {
      // console.log("INNER CLEAR");
      // @ts-ignore
      document.removeEventListener("keydown", handler, false);
    };
  }, []);
};

export const arrayToObject = <T extends { _id: string }>(inp: T[], key: keyof T = "_id") => {
  return inp.reduce((mapped: { [key: string]: T }, item: T) => {
    mapped[item._id] = item;
    return mapped;
  }, {});
};
