import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {Marker, Popup} from 'react-map-gl'
import SearchBar from './SearchBar'
import BarGraph from './BarGraphTest'
import redPointer from '../../public/red-location-pointer.png'
import greenPointer from '../../public/green-location-pointer.png'
import {green} from '@material-ui/core/colors'

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
      data: null,
      selectedMarkerImage: null,
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
    this.handleNeighborhoodMarkerClick = this.handleNeighborhoodMarkerClick.bind(
      this
    )
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

  handleAddressMarkerClick = () => {
    console.log('AN ADDRESS MARKER WAS CLICKED; WRITE MY FUNCTION!')
    //WRITE FUNCTION
  }

  handleNeighborhoodMarkerClick = (event, neighborhoodAggregate) => {
    //Popup Logic requires selectedAddress
    // THE BELOW IS SPECIFICALLY FOR AGGREGATES
    let marker
    if (this.state.selectedMarkerImage) {
      marker = this.state.selectedMarkerImage
      marker.src = greenPointer
    }
    event.target.src = redPointer
    let data = neighborhoodAggregate.complaints.map(complaintAggregate => {
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
        incident_address: neighborhoodAggregate.name,
        location: {
          coordinates: [
            neighborhoodAggregate.latitude,
            neighborhoodAggregate.longitude
          ]
        }
      },
      data,
      selectedMarkerImage: event.target
    })
  }

  handleMapClick = e => {
    e.preventDefault()
    // Add other logic to close popup
    //     this.setState({
    //       selectedAddress: null
    //     })
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

    const scrollZoom = !selectedAddress

    return (
      <div>
        <MapGL
          id="mapGl"
          scrollZoom={scrollZoom}
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
          {/* {selectedAddress ? (
            <Marker
              latitude={this.state.viewport.latitude}
              longitude={this.state.viewport.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <img
                src="https://cdn.pixabay.com/photo/2014/04/02/10/45/poi-304466_960_720.png"
                style={imageStyle}
                onClick={() => this.handleMarkerClick(complaint)}
              />
            </Marker>
          ) : null} */}
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
                          src={greenPointer}
                          onClick={() =>
                            this.handleAddressMarkerClick(complaint)
                          }
                        />{' '}
                        // THIS FUNCTION NEEDS TO BE WRITTEN
                      </Marker>
                    )
                  })
                : null}
            </div>
          ) : (
            <div>
              {neighborhoodComplaints
                ? neighborhoodComplaints.map(neighborhood => {
                    return (
                      <Marker
                        key={neighborhood.id}
                        latitude={neighborhood.latitude}
                        longitude={neighborhood.longitude}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <img
                          src={greenPointer}
                          onClick={event =>
                            this.handleNeighborhoodMarkerClick(
                              event,
                              neighborhood
                            )
                          }
                        />
                      </Marker>
                    )
                  })
                : null}
            </div>
          )}
          {/* SelectedAddress logic: Click a marker neighborhood ONLY */}
          {selectedAddress && this.state.viewport.zoom < 15.5 ? (
            <Popup
              latitude={this.state.viewport.latitude}
              longitude={this.state.viewport.longitude}
              style={{maxWidth: '200px'}}
              onClose={() => {
                this.setState({selectedAddress: null})
                const marker = this.state.selectedMarkerImage
                marker.src = greenPointer
                this.setState({selectedMarkerImage: null})
              }}
              className="popup"
            >
              <div>
                <BarGraph rawData={data} />
                <h1>
                  Total Complaints for {selectedAddress.incident_address}:
                </h1>
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

export default withStyles(styles)(HomePage)
// Function maybe:
/* Get neighborhood:

*/
