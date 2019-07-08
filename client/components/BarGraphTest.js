/* eslint-disable no-return-assign */
import chroma from 'chroma-js'
import * as d3 from 'd3'
import React, {Component} from 'react'

const width = 650
const height = 500
const margin = {top: 20, right: 5, bottom: 170, left: 75}
const red = '#eb6a5b'
const green = '#b6e86f'
const blue = '#52b6ca'
const colors = chroma.scale([blue, green, red]).mode('hsl')

export default class BarGraphTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      bars: [],
      xScale: d3
        .scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.5),
      yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
      colorScale: d3.scaleLinear()
    }

    this.xAxis = d3.axisBottom().scale(this.state.xScale)
    this.yAxis = d3.axisLeft().scale(this.state.yScale)
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!nextProps.rawData) return null
    const {rawData} = nextProps
    const {xScale, yScale, colorScale} = prevState

    let data = rawData

    // Set axes domain variables using data
    const frequencyMax = d3.max(data, d => d.frequency)
    const complaintDomain = data.map(complaint => complaint.type)
    xScale.domain(complaintDomain)
    yScale.domain([0, frequencyMax])

    // Set bar size values
    const bars = data.map(d => {
      return {
        x: xScale(d.type),
        y: yScale(d.frequency),
        width: xScale.bandwidth(),
        height: height - margin.bottom - yScale(d.frequency),
        fill: "url('#myGradient')"
      }
    })

    return {bars, frequencyMax, data}
  }

  axisFunc() {
    this.yAxis
      .ticks(this.state.frequencyMax > 25 ? 10 : this.state.frequencyMax)
      .tickFormat(d3.format('.0f')) // this specifies that the number of ticks should be equal to the max data value, the format is specifying no decimal points
    d3
      .select(this.refs.xAxis) // rather than this.xAxis.call().selectAll()... etc, use the d3.select() method with this.refs (can use React.createRef() if needed) to apply changes to elements within an svg group
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .style('font-size', '15px')
    d3
      .select(this.refs.yAxis)
      .call(this.yAxis)
      .selectAll('text')
      .style('font-size', '15px')
  }

  // Create Event Handlers for mouse
  handleMouseEnter = event => {
    const yValue = this.state.yScale.invert(event.target.y.animVal.value)

    // Specify where to put label of text
    const text = d3.select('.hoverText')
    console.log('bars', this.state.bars)
    text
      .select('text')
      .style('font-size', '16px')
      .style('textAnchor', 'middle')
      .attr('x', event.target.x.animVal.value + 10)
      .attr('dy', event.target.y.animVal.value - 5)
      .text(Math.floor(yValue))
  }

  handleMouseLeave = () => {
    const text = d3.select('.hoverText')
    console.log('exit')
    text
      .select('text')
      .style('font-size', '16px')
      .text(``)
  }

  componentDidUpdate() {
    this.axisFunc()
  }

  componentDidMount() {
    this.axisFunc()
  }

  render() {
    const {yScale, xScale} = this.state

    return (
      //width={width} height={height}</linearGradient>
      <svg ref="svg" className="svg-container" viewBox="0 0 500 500">
        {this.state.bars.map((d, i) => (
          <svg ref={element => (this.svg = d3.select(element))} key={i}>
            <defs>
              <linearGradient id="myGradient1" gradientTransform="rotate(90)">
                <stop offset="5%" stopColor="red" />
                <stop offset="50%" stopColor="gold" />
                <stop offset="95%" stopColor="green" />
              </linearGradient>

              <linearGradient id="myGradient2" gradientTransform="rotate(90)">
                <stop offset="5%" stopColor="gold" />
                <stop offset="95%" stopColor="green" />
              </linearGradient>

              <linearGradient id="myGradient3" gradientTransform="rotate(90)">
                <stop offset="95%" stopColor="green" />
              </linearGradient>
            </defs>
            <g className="hoverText">
              <rect
                ref={element => (this.rect = d3.select(element))}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                x={d.x}
                y={d.y}
                width={d.width}
                height={d.height}
                fill={
                  yScale.invert(d.y) > 10
                    ? "url('#myGradient1')"
                    : 5 < yScale.invert(d.y) && yScale.invert(d.y) <= 10
                      ? "url('#myGradient2')"
                      : "url('#myGradient3')"
                }
                value={{x: d.x, y: d.y}}
              />
              <text x={d.x} dy={d.y} />
            </g>
          </svg>
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </g>
        <text
          transform={`translate(${width / 2}, ${height - margin.bottom / 9})`}
          style={{
            textAnchor: 'middle',
            fontSize: '18px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold'
          }}
        >
          Incident Types
        </text>
        <text
          y={margin.left / 4}
          x={0 - height / 3}
          transform="rotate(-90)"
          style={{
            textAnchor: 'middle',
            fontSize: '18px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold'
          }}
        >
          Number of Incident Calls
        </text>
      </svg>
    )
  }
}
