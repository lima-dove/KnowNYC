import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {Marker, Popup} from 'react-map-gl'
import BarGraph from './BarGraphTest'
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  }
})

const token =
  'pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw'

class HomePage extends Component {
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
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handleSeeMoreClick = this.handleSeeMoreClick.bind(this)
    this.mapRef = React.createRef()
  }

  async handleSearchClick() {
    let boundary = this.mapRef.getMap().getBounds()
    const northLat = boundary._ne.lat
    const southLat = boundary._sw.lat
    const westLng = boundary._sw.lng
    const eastLng = boundary._ne.lng
    await axios.get(
      `/api/map/searchByArea/${northLat},${southLat},${westLng},${eastLng}`
    )
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
    const {classes} = this.props
    const {complaints, viewport, selectedAddress, data} = this.state
    const locationComplaints = complaints.filter(
      complaint => complaint.location
    )

    return (
      <div>
        <MapGL
          id="mapGl"
          {...viewport}
          width="100vw"
          height="88vh"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={v => this.setState({viewport: v})}
          preventStyleDiffing={false}
          ref={map => (this.mapRef = map)}
          mapboxApiAccessToken={token}
          onClick={this.handleMapClick}
        >
          {this.state.viewport.zoom > 15.5 ? (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button
                onClick={this.handleSearchClick}
                variant="contained"
                className={classes.button}
              >
                Search this area
              </Button>
            </div>
          ) : (
            ''
          )}
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

const newHomePage = withStyles(styles)(HomePage)

export default newHomePage
