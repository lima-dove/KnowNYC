import React from 'react'
import * as d3 from 'd3'
import {pie, arc} from 'd3-shape'
import {scaleOrdinal} from 'd3-scale'

const size = 350
const radius = size / 2
const colors = d3.scaleOrdinal(d3.schemeAccent)

const dataArc = arc()
  .outerRadius(radius - 10)
  .innerRadius(0)

const labelArc = arc()
  .outerRadius(radius - 70)
  .innerRadius(radius - 70)

const chart = pie()
  .sort(null)
  .value(d => d.quantity)

const width = 350
const height = 350

const PieChart = props => {
  const rawData = props.rowData
  let complaintObj = {}
  rawData.forEach(el => {
    if (complaintObj[el.complaint_type] >= 1) {
      complaintObj[el.complaint_type] = ++complaintObj[el.complaint_type]
    } else {
      complaintObj[el.complaint_type] = 1
    }
  })

  let data = []

  // eslint-disable-next-line guard-for-in
  for (let key in complaintObj) {
    data.push({type: key, quantity: complaintObj[key]})
  }

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
