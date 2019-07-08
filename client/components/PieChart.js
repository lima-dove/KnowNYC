import * as d3 from 'd3'
import {arc, pie} from 'd3-shape'
import React from 'react'
import {scaleOrdinal} from 'd3-scale'

const size = 500
const radius = size / 2
const colors = d3.scaleOrdinal(d3.schemePastel2)

const dataArc = arc()
  .outerRadius(radius - 40)
  .innerRadius(60)

const labelArc = arc()
  .outerRadius(radius - 100)
  .innerRadius(radius - 100)

const chart = pie()
  .padAngle(0.05)
  .sort(null)
  .value(d => d.frequency)

const width = 475
const height = 475

const angle = -90
function midAngle(d) {
  var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
  return a > 90 ? a - 180 : a
}
const fullCircle = d => {
  if (d.endAngle - d.startAngle >= 6) {
    return true
  }
}

const PieChart = props => {
  const data = props.data
  return (
    <div id="chart">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${radius}, ${radius})`}>
          {chart(data).map((d, i) => (
            <g key={i} className="arc">
              <path d={dataArc(d)} fill={colors(d.data.type)} />
              {fullCircle(d) ? (
                <text
                  dy=".35em"
                  transform={`translate(${labelArc.centroid(d)}`}
                >
                  {d.data.type}
                </text>
              ) : (
                <text
                  dy=".35em"
                  alignmentBaseline="middle"
                  transform={`translate(${labelArc.centroid(
                    d
                  )}), rotate(${midAngle(d)})`}
                >
                  {d.data.type}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
export default PieChart
