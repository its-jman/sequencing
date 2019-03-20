import React, { KeyboardEvent, useContext } from "react";
import { FiX } from "react-icons/fi";
import { observer } from "mobx-react-lite";

import { useTextInput } from "src/utils";
import { UIContext } from "src/state/stores/ui";

import styles from "./_sidebar.module.scss";

export const DescFilter = observer(() => {
  const uiStore = useContext(UIContext);
  const { value, setValue, onChange, ref } = useTextInput("");

  return (
    <div>
      <h2 className={styles.sidebarLabel}>Description filter</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          ref={ref}
          placeholder={'e.g. "DNA replication"'}
          onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.keyCode === 13) {
              event.stopPropagation();
              uiStore.updateFilter({ descFilter: value });
              setValue("");
              ref.current!.blur();
            }
          }}
        />
        <FiX
          className={styles.inputClear}
          size={18}
          onClick={() => {
            setValue("");
          }}
        />
      </div>
    </div>
  );
});
