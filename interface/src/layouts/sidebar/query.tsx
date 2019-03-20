import React, { KeyboardEvent, useContext, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import { useTextInput } from "src/utils";
import { QueriesContext } from "src/state/stores/queries";

import styles from "./_sidebar.module.scss";
import { observer } from "mobx-react-lite";
import { UIContext } from "src/state/stores/ui";
import { NetworkStatus } from "src/state/models";
import { when } from "mobx";

export const Query = observer(() => {
  const queriesStore = useContext(QueriesContext);
  const uiStore = useContext(UIContext);
  // const [disabled, setDisabled] = useState(false);
  const { value, setValue, onChange, ref } = useTextInput("", (val) => val.toUpperCase());

  useEffect(() => {
    const dispose = when(
      () => queriesStore.creation !== null && queriesStore.creation.ns === NetworkStatus.SUCCESS,
      () => {
        setValue("");
        queriesStore.creation = null;
      }
    );

    return () => dispose();
  }, []);

  return (
    <div>
      <h2 className={styles.sidebarLabel}>Query sequence</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type={"text"}
          list={"query-history"}
          placeholder={"e.g. RXRX33RR"}
          spellCheck={false}
          ref={ref}
          disabled={
            !!(queriesStore.creation !== null && queriesStore.creation.ns === NetworkStatus.REQUEST)
          }
          value={value}
          onChange={onChange}
          onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.keyCode === 13) {
              event.stopPropagation();
              // TODO:
              //    this should lock the inputs,
              //      onSuccess: Clear value, and set query.
              //      onFailure: list errors, unlock input
              const matching = queriesStore.getMatchingPattern(value);
              if (matching !== undefined) {
                uiStore.updateFilter({
                  queryId: matching._id
                });
                setValue("");
                ref.current!.blur();
              } else {
                queriesStore.createQuery(value);
              }
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
      <datalist id={"query-history"}>
        {Object.values(queriesStore.history).map((item) => (
          <option key={item._id} value={item.raw_pattern} />
        ))}
      </datalist>
      <div style={{ height: 180 }}>
        {queriesStore.creation !== null && queriesStore.creation.errors.length > 0 && (
          <ul>
            {queriesStore.creation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
