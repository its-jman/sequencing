import React, { PureComponent } from "react";

import { scaleBand, scaleLinear } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";

import styles from "./_dataTable.module.scss";
import { connect } from "src/state/connect";
import { IAminoDetails, IAppProps, IDataset } from "src/state/models";
import * as actions from "src/state/actions";
import { ALPHABET_COLORS } from "src/pages/constants";

type IData = {
  letter: string;
  actual: number;
  expected: number;
  diffRaw: number;
  percentDiff: number;
};

type IChartProps = {
  aminoDetails: IAminoDetails;
  data: Array<IData>;
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
    this._createChart();
  }

  _createChart = () => {
    if (this.node === null) throw new Error("Failed creating svg.");
    const { aminoDetails, data } = this.props;
    const fullAlphabet = new Set<string>([...Object.keys(aminoDetails), ".", "*"]);

    console.log(data.map((d) => d.percentDiff));
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
    // .on("mouseout", tip.hide);
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

/**
 *
 * @param {IAminoDetails} aminoDetails
 * @param {IDataset} dataset
 * @returns {Array<IData>}
 */
const calculateData = (aminoDetails: IAminoDetails, dataset: IDataset) => {
  const out: Array<IData> = [];
  // const out: Array<{ [letter: string]: number }> = [];
  // TODO: Convert to set
  for (const letter of Object.keys(aminoDetails)) {
    const details = aminoDetails[letter];
    if (!details.freq) continue;

    // expectedRaw: 1200; expected: 0.075
    const expectedRaw = Math.round(details.freq * dataset.analysis.amino_count);

    const actualRaw = dataset.analysis.distribution[letter] || 0;
    const actual = actualRaw / dataset.analysis.amino_count;

    const diffRaw = actual - details.freq;
    const percentDiff = (diffRaw / details.freq) * 100;

    /**
     * Actual: 3.5%
     * Expected: 7.2%
     * % Err: 1.2%
     *
     *
     */

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

    const aminoDetails = alphabet.data;
    const dataset = datasets.data[datasetID];
    const out = calculateData(aminoDetails, dataset);

    return <Chart aminoDetails={aminoDetails} data={out} />;
  }
}

export default connect(Distribution);
