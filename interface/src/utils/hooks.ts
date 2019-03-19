import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

// TODO: Figure out the proper way to destroy and re-use this instead of passing in an empty array
export const useKeydownHandler = (keydownMap: { [keyCode: number]: () => void }) => {
  useEffect(() => {
    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode in keydownMap) {
        // Could prevent major actions, don't use. ??
        // event.preventDefault();
        event.stopPropagation();
        keydownMap[event.keyCode]();
      }
    };
    // console.log("INNER REDO");
    // @ts-ignore
    document.addEventListener("keydown", handler, false);
    return () => {
      // @ts-ignore
      document.removeEventListener("keydown", handler, false);
    };
  }, []);
};

export const usePagination = (
  maxPage: number,
  initial: number = 0
): [number, (p: number) => void] => {
  const [page, setPageRaw] = useState(initial);

  const setPage = (p: number): void => {
    if (p < 0 || p > maxPage) {
      console.warn(`Invalid page: ${p}`);
    } else {
      setPageRaw(p);
    }
  };

  return [page, setPage];
};

export const useTextInput = (
  initial: string,
  valueModifier: (val: string) => string = (val) => val
): {
  value: string;
  setValue: (value: string) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ref: React.RefObject<HTMLInputElement>;
} => {
  const [value, setValue] = useState<string>(initial);
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(valueModifier(event.target.value));
  }, []);
  const ref = useRef<HTMLInputElement>(null);

  return {
    value,
    setValue,
    onChange,
    ref
  };
};
