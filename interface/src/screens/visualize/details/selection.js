import React from "react";
import { IoMdTrash } from "react-icons/io";

import Meta from "./components/meta";
import Alphabet from "./components/alphabet";
import Sequences from "./components/sequences";

export const SingleSelection = ({ dataset, match, _deleteDataset }) => {
  return (
    <React.Fragment>
      <Meta dataset={dataset} />
      <button onClick={() => _deleteDataset(dataset.id)}>
        <IoMdTrash size="24" />
      </button>
      <div className="dataset-details">
        <Alphabet dataset={dataset} />
      </div>
      <Sequences datasetID={dataset.id} />
    </React.Fragment>
  );
};
