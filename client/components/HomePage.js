import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {Marker, Popup} from 'react-map-gl'
import BarGraph from './BarGraphTest'
import SearchBar from './SearchBar'

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
      neighborhoodComplaints: null,
      selectedAddress: null,
      viewport: {
        latitude: 40.7484,
        longitude: -73.9857,
        zoom: 12,
        bearing: 0,
        pitch: 0
      }
    }
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handleSeeMoreClick = this.handleSeeMoreClick.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.mapRef = React.createRef()
  }

  async componentDidMount() {
    const {data} = await axios.get(`/api/map/getAll`)
    this.setState({
      neighborhoodComplaints: data
    })
  }

  async handleSearchClick() {
    let boundary = this.mapRef.getMap().getBounds()
    const northLat = boundary._ne.lat
    const southLat = boundary._sw.lat
    const westLng = boundary._sw.lng
    const eastLng = boundary._ne.lng
    const {data} = await axios.get(
      `/api/map/searchByArea/${northLat},${southLat},${westLng},${eastLng}`
    )
    this.setState({complaints: data})
  }

  handleMarkerClick = complaint => {
    console.log('MARKER CLICKED')
    console.log({complaint})
    //Popup Logic requires selectedAddress
    // THE BELOW IS SPECIFICALLY FOR AGGREGATES
    let data = complaint.complaints.map(complaintAggregate => {
      console.log({complaintAggregate})
      let aggregateObj = {
        type: complaintAggregate[0],
        frequency: complaintAggregate[1]
      }
      return aggregateObj
    })
    console.log('handlemarkerclick object', data)

    this.setState({
      selectedAddress: {
        incident_address: complaint.name,
        location: {coordinates: [complaint.latitude, complaint.longitude]}
      },
      data
    })
  }

  handleMapClick = () => {
    // this.setState({
    //   selectedAddress: null
    // })
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

  handleViewChange = viewport => {
    if (viewport.zoom < 15.5) {
      this.setState({viewport: viewport, complaints: []})
    } else {
      this.setState({viewport: viewport})
    }
  }

  async handleSearchSubmit(address) {
    const {data} = await axios.get(`api/map/getAddress/${address}`)
    this.setState({selectedAddress: data})
  }

  render() {
    const {classes} = this.props

    const {
      complaints,
      viewport,
      selectedAddress,
      data,
      neighborhoodComplaints
    } = this.state

    console.log('ADDRESS', selectedAddress)

    return (
      <div>
        <MapGL
          id="mapGl"
          {...viewport}
          width="100vw"
          height="88vh"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={v => this.handleViewChange(v)}
          preventStyleDiffing={false}
          ref={map => (this.mapRef = map)}
          mapboxApiAccessToken={token}
          onClick={this.handleMapClick}
        >
          <SearchBar handleSearchSubmit={this.handleSearchSubmit} />
          {selectedAddress ? (
            <Marker
              latitude={selectedAddress[0].latitude}
              longitude={selectedAddress[0].longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <img
                src="http://i.imgur.com/WbMOfMl.png"
                onClick={() => this.handleMarkerClick(complaint)}
              />
            </Marker>
          ) : null}
          {this.state.viewport.zoom > 15.5 ? (
            <div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button
                  onClick={this.handleSearchClick}
                  variant="contained"
                  className={classes.button}
                >
                  Search this area
                </Button>
              </div>
              {complaints
                ? complaints.map(complaint => {
                    return (
                      <Marker
                        key={complaint.id}
                        latitude={complaint.latitude}
                        longitude={complaint.longitude}
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
            </div>
          ) : (
            <div>
              {neighborhoodComplaints
                ? neighborhoodComplaints.map(complaint => {
                    return (
                      <Marker
                        key={complaint.id}
                        latitude={complaint.latitude}
                        longitude={complaint.longitude}
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
            </div>
          )}
          {selectedAddress ? (
            <Popup
              latitude={selectedAddress[0].latitude}
              longitude={selectedAddress[0].longitude}
              onClose={() => this.setState({selectedAddress: null, data: null})}
            >
              {/* <div>
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
              </div> */}
            </Popup>
          ) : (
            console.log('NO SELECTED ADDRESS, OR IS NULL')
          )}
        </MapGL>
      </div>
    )
  }
}

export default withStyles(styles)(HomePage)
// Function maybe:
/* Get neighborhood:

*/
