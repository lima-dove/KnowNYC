import * as d3 from 'd3'
import {arc, pie} from 'd3-shape'
import React from 'react'
import {scaleOrdinal} from 'd3-scale'

const size = 180
const radius = size / 2
const colors = d3.scaleOrdinal(d3.schemeAccent)

const dataArc = arc()
  .outerRadius(radius - 40)
  .innerRadius(0)

const labelArc = arc()
  .outerRadius(radius - 0)
  .innerRadius(radius - 0)

const chart = pie()
  .sort(null)
  .value(d => d.frequency)

const width = 180
const height = 180

const PieChart = props => {
  const data = props.data
  // let complaintObj = {}
  // data.forEach(el => {
  //   if (complaintObj[el.type] >= 1) {
  //     complaintObj[el.type] = ++complaintObj[el.type]
  //   } else {
  //     complaintObj[el.type] = 1
  //   }
  // })

  // let data = []

  // eslint-disable-next-line guard-for-in
  // for (let key in complaintObj) {
  //   data.push({type: key, quantity: complaintObj[key]})
  // }

  return (
    <div id="chart">
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
    </div>
  )
}

export default PieChart
