import React, { PureComponent } from "react";

import styles from "./_dataTable.module.scss";
import { connect } from "src/state/connect";
import { IAlphabet, IAppProps, IDataset, IDispatchProps } from "src/state/models";
import * as actions from "src/state/actions";

const calculateData = (fullAlphabet: IAlphabet, dataset: IDataset) => {
  // const out: {
  //   [letter: string]: { actual: number; expected: number; diffRaw: number; percentDiff: number };
  // } = {};
  const out: Array<{ [letter: string]: number }> = [];
  // TODO: Convert to set
  for (const letter of Object.keys(fullAlphabet)) {
    const details = fullAlphabet[letter];
    if (!details.freq) continue;

    const actualRaw = dataset.analysis.distribution[letter] || 0;
    const actual = actualRaw / dataset.analysis.amino_count;

    const diffRaw = actual - details.freq;
    const percentDiff = (diffRaw / details.freq) * 100;

    /*out[letter] = {
      actual: Math.round(actual * 100) / 100,
      expected: details.freq,
      diffRaw: Math.round(diffRaw * 1000) / 1000,
      percentDiff: Math.round(percentDiff)
    };*/
    out.push({ [letter]: percentDiff });
  }

  return out;
};

type IChartProps = {};

class Chart extends PureComponent<IChartProps> {
  node: SVGSVGElement | null = null;

  componentDidMount() {
    this._createChart();
  }

  componentDidUpdate(prevProps: Readonly<IChartProps>) {
    this._updateChart();
  }

  _createChart = () => {};

  _updateChart = () => {};

  render() {
    return <svg ref={(node) => (this.node = node)} width={275} height={180} />;
  }
}

class Distribution extends PureComponent<IAppProps> {
  componentDidMount(): void {
    this.props.dispatch(actions.fetchAlphabet());
  }

  render() {
    const { datasets, alphabet } = this.props.state;
    if (Object.keys(datasets.data).length === 0 || Object.keys(alphabet.data).length === 0) {
      return null;
    }
    const datasetID = Object.keys(datasets.data)[0];

    const fullAlphabet = alphabet.data;
    const dataset = datasets.data[datasetID];
    const out = calculateData(fullAlphabet, dataset);

    return <Chart />;
  }
}

export default connect(Distribution);
