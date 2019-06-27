import React from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

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
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=162-01%2099%20STREET'
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
    this.setState({barChartData: barChartData, lineGraphData: lineGraphData})
    console.log(
      'BAR CHART DATA:',
      this.state.barChartData,
      'LINE GRAPH DATA:',
      this.state.lineGraphData
    )
  }
  render() {
    return (
      <div>
        <Typography variant="h2" align="center">
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
      </div>
    )
  }
}

export default ExampleComplaints
