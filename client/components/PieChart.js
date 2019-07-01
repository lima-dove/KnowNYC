import React from 'react'
import * as d3 from 'd3'
import {pie, arc} from 'd3-shape'
import {scaleOrdinal} from 'd3-scale'

const size = 300
const radius = size / 2
const colors = d3.scaleOrdinal(d3.schemeAccent)

const dataArc = arc()
  .outerRadius(radius - 10)
  .innerRadius(0)

const labelArc = arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40)

// const colour = scaleOrdinal([
//   '#98abc5',
//   '#8a89a6',
//   '#7b6888',
//   '#6b486b',
//   '#ff8c00'
// ])

const chart = pie()
  .sort(null)
  .value(d => d.quantity)

const width = 300
const height = 300

const PieChart = ({data}) => {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${radius}, ${radius})`}>
        {chart(data).map((d, i) => (
          <g key={i} className="arc">
            <path d={dataArc(d)} fill={colors(d.data.type)} />

            <text dy=".35em" transform={`translate(${labelArc.centroid(d)})`}>
              {d.data.type}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default PieChart
