import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {Marker, Popup} from 'react-map-gl'
import BarGraph from './BarGraphTest'

const token =
  'pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw'

export default class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      complaints: [],
      selectedAddress: null,
      data: null,
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
    })
  }

  handleMarkerClick = async complaint => {
    let address = complaint.incident_address
    const {data} = await axios.get(
      `https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=${address}&incident_zip=10004`
    )
    //Popup Logic
    this.setState({
      selectedAddress: complaint,
      data
    })
  }

  handleMapClick = () => {
    this.setState({
      selectedAddress: null
    })
  }

  handleSeeMoreClick = complaint => {
    //Redirect to Info Page Logic
    const {history} = this.props
    let clickedAddress
    if (complaint.incident_address) {
      clickedAddress = complaint.incident_address.replace(/ /g, '-')
    } else {
      clickedAddress = ''
    }
    //pushes the complaint data as state to history object
    //can now the be accessed using history.state.state
    history.push(`/exampleComplaints/${clickedAddress}`, complaint)
  }

  render() {
    const {complaints, viewport, selectedAddress, data} = this.state
    const locationComplaints = complaints.filter(
      complaint => complaint.location
    )
    console.log('render')

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
          onClick={this.handleMapClick}
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
                      onClick={() => this.handleMarkerClick(complaint)}
                    />
                  </Marker>
                )
              })
            : null}

          {selectedAddress ? (
            <Popup
              latitude={selectedAddress.location.coordinates[1]}
              longitude={selectedAddress.location.coordinates[0]}
              onClose={() => this.setState({selectedAddress: null, data: null})}
            >
              <div>
                <BarGraph rawData={data} />
                <h1>Complaints for {selectedAddress.incident_address}</h1>
                <h3>Complaint Type: {selectedAddress.complaint_type}</h3>
                <p>Description: {selectedAddress.descriptor}</p>
                <button
                  type="button"
                  onClick={() => this.handleSeeMoreClick(selectedAddress)}
                >
                  See More...
                </button>
              </div>
            </Popup>
          ) : null}
        </MapGL>
      </div>
    )
  }
}
