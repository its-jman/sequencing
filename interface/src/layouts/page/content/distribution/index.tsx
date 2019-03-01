import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { scaleBand, scaleLinear } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";

import { IAlphabetState, IAppState, IDataset, IDispatchProps } from "src/state/models";
import { basicActions } from "src/state/actions/actions";
import { ALPHABET_COLORS } from "src/layouts/page/constants";
import { isEmpty } from "src/utils";

import styles from "./_distribution.module.scss";
import { actions } from "src/state/actions";

type IData = {
  letter: string;
  actual: number;
  expected: number;
  diffRaw: number;
  percentDiff: number;
};

type IChartProps = {
  alphabet: IAlphabetState;
  data: IData[];
};

class DistributionTip extends PureComponent<{ data: IData }> {
  render() {
    const { data } = this.props;
    return (
      <div>
        {`% Error: ${data.percentDiff}`}
        {`Actual: ${data.actual}`}
        {`Expected: ${data.expected}`}
        {`Actual: ${data.actual}`}
      </div>
    );
  }
}

class Chart extends PureComponent<IChartProps> {
  static SVGHeight = 145;
  static SVGWidth = 280;
  static margin = 30;
  static height = Chart.SVGHeight - Chart.margin;
  static width = Chart.SVGWidth - Chart.margin;
  static bounds: { top: number; bottom: number; left: number; right: number } = {
    top: 0 + Chart.margin,
    bottom: Chart.margin + Chart.height,
    left: 0 + Chart.margin,
    right: Chart.margin + Chart.width
  };

  node: SVGSVGElement | null = null;

  componentDidMount() {
    this._createChart();
  }

  componentDidUpdate() {
    console.warn("UPDATING DISTRIBUTION GRAPH");
    this._createChart();
  }

  _createChart = () => {
    if (this.node === null) throw new Error("Failed creating svg.");
    const { alphabet, data } = this.props;
    const fullAlphabet = new Set<string>([...Object.keys(alphabet), ".", "*"]);

    const dataMax = Math.max(...data.map((d) => d.percentDiff));
    const dataMin = Math.min(...data.map((d) => d.percentDiff));
    const maxScale = Math.max(Math.abs(dataMax), Math.abs(dataMin));

    const xScaleRaw = scaleBand()
      .domain(Array.from(fullAlphabet))
      .range([Chart.bounds.left, Chart.bounds.right])
      .padding(0.3);

    const yScaleRaw = scaleLinear()
      .domain([-maxScale, maxScale])
      .range([Chart.bounds.bottom, Chart.bounds.top]);

    const svg = d3Select(this.node);
    const chart = svg.append("g"); //.attr("transform", `translate(${Chart.margin}, ${Chart.margin})`);

    const yAxisRaw = axisLeft(yScaleRaw)
      .ticks(6)
      .tickSizeOuter(0);

    const yAxis = svg
      .append("g")
      .attr("transform", `translate(${Chart.margin}, 0)`)
      .call(yAxisRaw);

    const bottomAxisRaw = axisBottom(xScaleRaw).tickSizeOuter(0);
    const bottomAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${Chart.bounds.bottom})`)
      .call(bottomAxisRaw);

    const zeroAxisRaw = axisBottom(xScaleRaw)
      .tickValues([])
      .tickSizeOuter(0);
    const zeroAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${yScaleRaw(0)})`)
      .call(zeroAxisRaw);

    const bars = chart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => {
        const x = xScaleRaw(d.letter);
        if (x !== undefined) return x;
        console.log("RETURNING NULL X");
        return null;
      })
      .attr("y", (d) => {
        let y = yScaleRaw(d.percentDiff);
        if (d.percentDiff < 0) {
          y = yScaleRaw(0);
        }
        return y;
      })
      .attr("width", xScaleRaw.bandwidth())
      .attr("height", (d) => {
        const y = yScaleRaw(d.percentDiff);
        const y0 = yScaleRaw(0);

        return Math.abs(y - y0);
      })
      .attr("fill", (d) => ALPHABET_COLORS[d.letter]);
    // .on("mouseover", tip.show)
    // .on("mouseout", tip.hideModal);
  };

  render() {
    return (
      <svg
        className={styles.svg}
        ref={(node) => (this.node = node)}
        height={Chart.SVGHeight + 35}
        width={Chart.SVGWidth + 25}
      />
    );
  }
}

const calculateData = (alphabet: IAlphabetState, dataset: IDataset) => {
  const out: IData[] = [];
  // const out: Array<{ [letter: string]: number }> = [];
  // TODO: Convert to set
  for (const letter of Object.keys(alphabet)) {
    const details = alphabet[letter];
    if (!details.freq) continue;

    // expectedRaw: 1200; expected: 0.075
    const expectedRaw = Math.round(details.freq * dataset.analysis.amino_count);

    const actualRaw = dataset.analysis.distribution[letter] || 0;
    const actual = actualRaw / dataset.analysis.amino_count;

    const diffRaw = actual - details.freq;
    const percentDiff = (diffRaw / details.freq) * 100;

    out.push({
      letter: letter,
      actual: Math.round(actual * 100) / 100,
      expected: details.freq,
      diffRaw: Math.round(diffRaw * 1000) / 1000,
      percentDiff: Math.round(percentDiff)
    });
    // out.push({ [letter]: percentDiff });
  }

  return out;
};

type IDistributionProps = {
  alphabet: IAlphabetState;
  dataset: IDataset;
} & IDispatchProps;

class Distribution extends PureComponent<IDistributionProps> {
  constructor(props: IDistributionProps) {
    super(props);
    this.props.dispatch(actions.fetchAlphabet());
  }

  render() {
    const { dataset, alphabet } = this.props;
    if (isEmpty(dataset) || isEmpty(alphabet)) {
      return null;
    }

    const out = calculateData(alphabet, dataset);
    return <Chart alphabet={alphabet} data={out} />;
  }
}

export default connect(
  (state: IAppState) => ({
    alphabet: state.data.alphabet
  }),
  (dispatch) => ({ dispatch })
)(Distribution);
