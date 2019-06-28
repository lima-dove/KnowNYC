import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {Marker} from 'react-map-gl'

const token =
  'pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw'

export default class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      viewport: {
        latitude: 40.705,
        longitude: -74.009,
        zoom: 14,
        bearing: 0,
        pitch: 0
      },
      complaints: []
    }
  }

  async componentDidMount() {
    const {data} = await axios.get(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=162-01%2099%20STREET'
    )
    this.setState({
      complaints: data
    })
  }

  handleClick = () => {
    const {history} = this.props

    history.push('/exampleComplaints')
  }

  render() {
    const {viewport} = this.state
    return (
      <div>
        <MapGL
          {...viewport}
          width="100vw"
          height="88vh"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={v => this.setState({viewport: v})}
          preventStyleDiffing={false}
          mapboxApiAccessToken={token}
        >
          {this.state.complaints.map(complaint => {
            return (
              <Marker
                key={complaint.unique_key}
                latitude={complaint.location.coordinates[1]}
                longitude={complaint.location.coordinates[0]}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <img
                  src="http://i.imgur.com/WbMOfMl.png"
                  onClick={this.handleClick}
                />
              </Marker>
            )
          })}
        </MapGL>
      </div>
    )
  }
}
