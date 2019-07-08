/* eslint-disable complexity */
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import axios from 'axios'
import React, {Component} from 'react'
import MapGL, {FlyToInterpolator, Marker, Popup} from 'react-map-gl'
import greenDot from '../../markers/green-circle.png'
import greenPointer from '../../markers/green-marker.png'
import redDot from '../../markers/red-circle.png'
import redPointer from '../../markers/red-marker.png'
import BarGraph from './BarGraphTest'
import InfoPage from './InfoPage'
import SearchBar from './SearchBar'
import Sidebar from './Sidebar'

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    justifySelf: 'center'
  }
})

const dotStyle = {width: '15px', height: '15px'}

const token =
  'pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw'

class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      complaints: [],
      neighborhoodComplaints: null,
      boundaryAddresses: null,
      selectedNeighborhood: null,
      selectedAddress: null,
      data: null,
      searchError: false,
      selectedMarkerImage: null,
      selectedDotImage: null,
      viewport: {
        latitude: 40.7484,
        longitude: -73.9857,
        zoom: 12,
        bearing: 0,
        pitch: 0
      },
      mouse: false
    }
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleNeighborhoodMarkerClick = this.handleNeighborhoodMarkerClick.bind(
      this
    )
    this.handleSeeMoreClick = this.handleSeeMoreClick.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleAddressMarkerClick = this.handleAddressMarkerClick.bind(this)
    this.mouseHandle = this.mouseHandle.bind(this)
    this.onCloseAddressPopup = this.onCloseAddressPopup.bind(this)
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
    this.setState({boundaryAddresses: data})
  }

  async handleAddressMarkerClick(event, address) {
    let dot
    if (this.state.selectedDotImage) {
      dot = this.state.selectedDotImage
      dot.src = greenDot
    }
    event.target.src = redDot
    this.setState({
      selectedDotImage: event.target
    })

    let response
    if (address.incident_address) {
      response = await axios.get(
        `api/map/getAddress/A${address.incident_address}`
      )
    } else {
      response = await axios.get(
        `api/map/getAddress/C${address.latitude},${address.longitude}`
      )
    }
    await this.setState({
      selectedAddress: response.data
    })
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
      let aggregateObj = {
        type: complaintAggregate[0],
        frequency: complaintAggregate[1]
      }
      return aggregateObj
    })

    this.setState({
      selectedNeighborhood: {
        incident_address: neighborhoodAggregate.name,
        total: neighborhoodAggregate.total,
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
      this.setState({viewport: viewport, boundaryAddresses: null})
    } else {
      this.setState({viewport: viewport})
    }
  }

  async handleSearchSubmit(address) {
    try {
      const {data} = await axios.get(`api/map/getAddress/A${address}`)
      this.setState({
        selectedAddress: data,
        viewport: {
          latitude: data.latitude,
          longitude: data.longitude,
          zoom: 18,
          bearing: 0,
          pitch: 0
        }
      })
    } catch (error) {
      if (error.response.status === 500) {
        this.setState(
          {
            searchError: true
          },
          () => {
            setTimeout(() => {
              this.setState({searchError: false})
            }, 3000)
          }
        )
      }
    }
  }

  mouseHandle() {
    this.setState({mouse: true})
  }

  onCloseAddressPopup() {
    const dot = this.state.selectedDotImage
    dot.src = greenDot
    this.setState({
      selectedDotImage: null,
      selectedAddress: null,
      mouse: false
    })
  }

  render() {
    const {classes} = this.props

    const {
      boundaryAddresses,
      viewport,
      selectedAddress,
      selectedNeighborhood,
      selectedMarkerImage,
      selectedDotImage,
      data,
      neighborhoodComplaints,
      mouse,
      searchError
    } = this.state

    const scrollZoom = !selectedMarkerImage && !selectedDotImage

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
          transitionDuration={selectedAddress ? 2000 : 0}
          transitionInterpolator={
            selectedAddress ? new FlyToInterpolator() : null
          }
        >
          <div style={{display: 'flex'}}>
            <div id="sideSearch">
              <SearchBar
                handleSearchSubmit={this.handleSearchSubmit}
                captureClick={true}
                error={searchError}
              />
              <Sidebar viewport={viewport.zoom} />
            </div>

            {selectedAddress ? (
              <Marker
                latitude={selectedAddress.latitude}
                longitude={selectedAddress.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <img
                  style={dotStyle}
                  src={greenDot}
                  onClick={() =>
                    this.handleAddressMarkerClick(event, selectedAddress)
                  }
                />
              </Marker>
            ) : null}

            {this.state.viewport.zoom > 15.5 ? (
              <div>
                <div style={{display: 'flex'}}>
                  <Button
                    onClick={this.handleSearchClick}
                    variant="contained"
                    className={classes.button}
                    style={{zIndex: '10'}}
                  >
                    Search this area
                  </Button>
                </div>
                {boundaryAddresses
                  ? boundaryAddresses.map(address => {
                      return (
                        <Marker
                          key={address.id}
                          latitude={address.latitude}
                          longitude={address.longitude}
                          offsetLeft={-20}
                          offsetTop={-10}
                        >
                          <img
                            style={dotStyle}
                            src={greenDot}
                            onClick={event =>
                              this.handleAddressMarkerClick(event, address)
                            }
                          />
                        </Marker>
                      )
                    })
                  : null}
              </div>
            ) : (
              <div>
                {neighborhoodComplaints
                  ? neighborhoodComplaints.map(neighborhoodAggregate => {
                      return (
                        <Marker
                          key={neighborhoodAggregate.id}
                          latitude={neighborhoodAggregate.latitude}
                          longitude={neighborhoodAggregate.longitude}
                          offsetLeft={-20}
                          offsetTop={-10}
                        >
                          <img
                            src={greenPointer}
                            onClick={event =>
                              this.handleNeighborhoodMarkerClick(
                                event,
                                neighborhoodAggregate
                              )
                            }
                          />
                        </Marker>
                      )
                    })
                  : null}
              </div>
            )}
          </div>
          {/* NEIGHBORHOOD POPUP */}
          {selectedNeighborhood ? (
            <Popup
              latitude={this.state.viewport.latitude}
              longitude={this.state.viewport.longitude}
              onClose={() => {
                const marker = this.state.selectedMarkerImage
                marker.src = greenPointer
                this.setState({
                  selectedNeighborhood: null,
                  selectedMarkerImage: null
                })
              }}
              className="popup"
            >
              <div>
                <h1>{selectedNeighborhood.incident_address}</h1>
                <BarGraph rawData={data} />
                <h2>
                  Total Complaints for {selectedNeighborhood.incident_address}:{' '}
                  <span> {selectedNeighborhood.total}</span>
                </h2>
              </div>
            </Popup>
          ) : null}

          {/*ADDRESS POPUP */}
          {selectedAddress ? (
            <Popup
              closeOnClick={false}
              latitude={this.state.viewport.latitude}
              longitude={this.state.viewport.longitude}
              onClose={this.onCloseAddressPopup}
              className="popup"
            >
              <InfoPage data={selectedAddress} />
            </Popup>
          ) : null}
        </MapGL>
      </div>
    )
  }
}

export default withStyles(styles)(HomePage)
