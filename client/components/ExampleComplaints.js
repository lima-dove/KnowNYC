import React from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LineGraph from './LineGraph'

class ExampleComplaints extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      complaints: [],
      address: '',
      long: '',
      lat: '',
      lineGraphData: {},
      barChartData: {}
    }
  }
  async componentDidMount() {
    const {data} = await axios.get(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$limit=100'
    )
    this.setState({
      complaints: data,
      address: data[0].incident_address,
      long: data[0].location.coordinates[0],
      lat: data[0].location.coordinates[1]
    })
    let lineGraphData = {}
    let barChartData = {}
    this.state.complaints.forEach(complaint => {
      const complaintType = complaint.complaint_type
      if (barChartData[complaintType]) {
        barChartData[complaintType]++
      } else {
        barChartData[complaintType] = 1
      }
    })
    this.state.complaints.forEach(complaint => {
      const year = Number(complaint.created_date.slice(0, 4))
      if (lineGraphData[year]) {
        lineGraphData[year]++
      } else {
        lineGraphData[year] = 1
      }
    })
    let keys = Object.keys(lineGraphData)
    let lineGraphProps = keys.map(key => {
      return [key, lineGraphData[key]]
    })
    this.setState({barChartData: barChartData, lineGraphData: lineGraphProps})
    console.log(
      'BAR CHART DATA:',
      this.state.barChartData,
      'LINE GRAPH DATA:',
      this.state.lineGraphData
    )
  }
  render() {
    const data = this.state.lineGraphData
    return (
      <div>
        <Typography variant="h1" align="center" color="inherit">
          Address: {this.state.address}
          <br />
          Long/Lat: [{this.state.long}, {this.state.lat}]
        </Typography>
        {this.state.complaints.map(complaint => {
          return (
            <ListItem key={complaint.unique_key}>
              <ListItemText>{complaint.complaint_type}</ListItemText>
            </ListItem>
          )
        })}
        <LineGraph data={data} />
      </div>
    )
  }
}

export default ExampleComplaints
