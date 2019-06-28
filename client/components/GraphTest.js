import React, {Component} from 'react'
import BarGraphTest from './BarGraphTest'

export default class GraphTest extends Component {
  constructor() {
    super()
    this.state = {
      complaints: []
    }
  }

  componentDidMount() {
    fetch(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=162-01%2099%20STREET'
    )
      .then(response => response.json())
      .then(response => {
        response.forEach(complaint => {
          complaint.created_date = new Date(complaint.created_date)
        })

        this.setState({
          complaints: response
        })
      })
  }

  render() {
    return (
      <div>
        <BarGraphTest data={this.state.complaints} />
      </div>
    )
  }
}
