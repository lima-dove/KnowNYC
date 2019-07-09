// import React, {Component} from 'react'
// import BarGraphTest from './BarGraphTest'
// import PieChart from './PieChart'

// export default class GraphTest extends Component {
//   constructor() {
//     super()
//     this.state = {
//       complaints: []
//     }
//   }

//   componentDidMount() {
//     fetch(
//       'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=2303%20LAFAYETTE%20AVENUE'
//     )
//       .then(response => response.json()) // this returns an array of objects
//       .then(response => {
//         response.forEach(complaint => {
//           complaint.created_date = new Date(complaint.created_date) // format the date for d3 to read
//         })

//         this.setState({complaints: response})
//       })
//   }

//   render() {
//     return (
//       <div>
//         <BarGraphTest rawData={this.state.complaints} />
//         <PieChart rowData={this.state.complaints} />
//       </div>
//     )
//   }
// }

// // want an array (set) of unique complaint types (ex: if barData.includes(el[complaint_type]) then increment el[complaint_type])
// // if (barData.some(el => el.type === complaint.complaint_type)) {
// // }
