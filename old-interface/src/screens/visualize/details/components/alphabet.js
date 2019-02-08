import React from 'react';
import {ALPHABET_COLORS} from "../../../../constants";

class Alphabet extends React.Component {
  render() {
    const { dataset } = this.props;

    return (
      <ul>
        {Object.keys(dataset.records_meta.alphabet).map((k) => {
          const val = dataset.records_meta.alphabet[k];
          const percentage = val / dataset.records_meta.amino_acid_count;

          return (
            <li key={k} style={{ padding: "4px", backgroundColor: ALPHABET_COLORS[k] }}>
              {k}: {(percentage * 100).toFixed(3)}%
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Alphabet;
