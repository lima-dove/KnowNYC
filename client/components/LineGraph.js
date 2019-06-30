import React, {Component} from 'react'
import * as d3 from 'd3'

const width = 650
const height = 400
const margin = {top: 20, right: 5, bottom: 20, left: 35}
const red = '#eb6a5b'
const blue = '#52b6ca'

class LineGraph extends Component {
  state = {
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line()
  }

  xAxis = d3
    .axisBottom()
    .scale(this.state.xScale)
    .tickFormat('Year')
  yAxis = d3
    .axisLeft()
    .scale(this.state.yScale)
    .tickFormat('Frequency')

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null // data hasn't been loaded yet so do nothing
    const {data} = nextProps
    const {xScale, yScale, lineGenerator} = prevState

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d[0])
    const tempMax = d3.max(data, d => d[1])
    xScale.domain(timeDomain)
    yScale.domain([0, tempMax])

    // calculate line for lows
    lineGenerator.x(d => xScale(d.created_date))
    lineGenerator.y(d => yScale(d.low))
    const lows = lineGenerator(data)
    // and then highs
    lineGenerator.y(d => yScale(d.high))
    const highs = lineGenerator(data)

    return {lows, highs}
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis)
    d3.select(this.refs.yAxis).call(this.yAxis)
  }

  render() {
    return (
      <svg width={width} height={height}>
        <path d={this.state.highs} fill="none" stroke={red} strokeWidth="2" />
        <path d={this.state.lows} fill="none" stroke={blue} strokeWidth="2" />
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    )
  }
}

export default LineGraph
