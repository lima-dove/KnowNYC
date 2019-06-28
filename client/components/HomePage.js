import React, {Component} from 'react'
import MapGL, {Marker} from 'react-map-gl'
import axios from 'axios'

const token =
  'pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw'

export default class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      complaints: [],
      viewport: {
        latitude: 40.705,
        longitude: -74.009,
        zoom: 14,
        bearing: 0,
        pitch: 0
      }
    }
  }
  async componentDidMount() {
    const {data} = await axios.get(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_zip=10004'
    )
    this.setState({
      complaints: data
      // address: data[0].incident_address,
      // long: data[0].location.coordinates[0],
      // lat: data[0].location.coordinates[1]
    })
  }

  handleClick = () => {
    const {history} = this.props

    history.push('/exampleComplaints')
  }

  render() {
    const {complaints, viewport} = this.state
    console.log('COMPLAINTS====', complaints[0])
    const locationComplaints = complaints.filter(
      complaint => complaint.location
    )

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
          {locationComplaints
            ? locationComplaints.map(complaint => {
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
              })
            : null}
        </MapGL>
      </div>
    )
  }
}
