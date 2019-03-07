import React, { ChangeEvent, KeyboardEvent, useState } from "react";

import * as api from "src/api";
import styles from "./_query.module.scss";
import { connect } from "react-redux";
import { IAppState } from "src/state/models";

const QuerySelection = ({ datasetId }: { datasetId: string }) => {
  const [rawPattern, setRawPattern] = useState("");

  return (
    <>
      <input
        type="text"
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.keyCode === 13) {
            if (datasetId === undefined) {
              console.error("No Datasets!!!!!");
            } else {
              api.createQuery(rawPattern).then((resp) => {
                api
                  .queryDataset(resp.query_id, datasetId)
                  .then((resp) => {
                    console.log("RESP");
                    console.log(resp);
                  })
                  .catch((err) => {
                    console.log("ERR");
                    console.log(err);
                  });
                resp.query_id;
              });
            }
          }
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setRawPattern(event.target.value);
        }}
      />
    </>
  );
};

export default connect((state: IAppState) => ({
  datasetId: Object.keys(state.data.datasets)[0]
}))(QuerySelection);
