/* eslint-disable complexity */
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import axios from 'axios'
import React, {Component} from 'react'
import {render} from 'react-dom'
import MapGL, {
  FlyToInterpolator,
  LinearInterpolator,
  Marker,
  Popup
} from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import bbox from '@turf/bbox'
import greenDot from '../../markers/green-circle.png'
import greenPointer from '../../markers/green-marker.png'
import redDot from '../../markers/red-circle.png'
import redPointer from '../../markers/red-marker.png'
import InfoPage from './InfoPage'
import NeighborhoodInfoPage from './NeighborhoodInfoPage'
import SearchBar from './SearchBar'
import Sidebar from './Sidebar'
import MAP_STYLE from '../../public/MapStyle'

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
      addressUserComplaints: null,
      data: null,
      searchError: false,
      selectedMarkerImage: null,
      selectedDotImage: null,
      flyTo: false,
      viewport: {
        latitude: 40.7484,
        longitude: -73.9857,
        zoom: 12,
        bearing: 0,
        pitch: 0
      },
      mouse: false,
      hoverInfo: null
    }

    this.searchDot = React.createRef()

    this.handleSearchClick = this.handleSearchClick.bind(this)
    // this.handleMapClick.bind(this)
    this.handleNeighborhoodMarkerClick = this.handleNeighborhoodMarkerClick.bind(
      this
    )
    this.handleEscape = this.handleEscape.bind(this)
    this.handleSeeMoreClick = this.handleSeeMoreClick.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleAddressMarkerClick = this.handleAddressMarkerClick.bind(this)
    this.mouseHandle = this.mouseHandle.bind(this)
    this.onCloseAddressPopup = this.onCloseAddressPopup.bind(this)
    this.mapRef = React.createRef()
    this._map = React.createRef()
    this._onClick = this._onClick.bind(this)
  }

  async componentDidMount() {
    const {data} = await axios.get(`/api/map/getAll`)
    this.setState({
      neighborhoodComplaints: data
    })
  }

  _onClick = event => {
    console.log('clicked')
    const feature = event.features[0]
    console.log('FEATURE', feature)
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature)
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport)
      const {longitude, latitude, zoom} = viewport.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        {
          padding: 40
        }
      )

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new LinearInterpolator({
            around: [event.offsetCenter.x, event.offsetCenter.y]
          }),
          transitionDuration: 1000
        }
      })
    }
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

    let response311
    let responseUser
    if (address.incident_address) {
      response311 = await axios.get(
        `api/map/getAddress/A${address.incident_address}`
      )
      responseUser = await axios.get(
        `api/user-complaint/A${address.incident_address}`
      )
    } else {
      response311 = await axios.get(
        `api/map/getAddress/C${address.latitude},${address.longitude}`
      )
      responseUser = await axios.get(
        `api/user-complaint/C${address.latitude},${address.longitude}`
      )
    }
    await this.setState({
      selectedAddress: response311.data,
      addressUserComplaints: responseUser.data
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

    let aggregateObj = {
      name: neighborhoodAggregate.name,
      total: neighborhoodAggregate.total,
      aggregate_data: []
    }

    aggregateObj.aggregate_data = neighborhoodAggregate.complaints.map(
      complaintAggregate => {
        let aggregate = {
          type: complaintAggregate[0],
          frequency: complaintAggregate[1]
        }
        return aggregate
      }
    )

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
      data: aggregateObj,
      selectedMarkerImage: event.target
    })
  }

  // handleMapClick = e => {
  //   e.preventDefault()
  // }

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
      const response311 = await axios.get(`api/map/getAddress/A${address}`)
      const responseUser = await axios.get(`api/user-complaint/A${address}`)

      if (this.state.selectedNeighborhood) {
        this.onCloseNeighborhoodPopup()
      } else if (this.state.selectedAddress) {
        this.onCloseAddressPopup()
      }

      // let dot
      // if (this.state.selectedDotImage) {
      //   dot = this.state.selectedDotImage
      //   dot.src = greenDot
      // }

      this.setState({
        selectedAddress: response311.data,
        selectedNeighborhood: null,
        addressUserComplaints: responseUser.data,
        flyTo: true,
        viewport: {
          latitude: response311.data.latitude,
          longitude: response311.data.longitude,
          zoom: 18,
          bearing: 0,
          pitch: 0
        }
      })
      this.searchDot.current.src = redDot
      this.setState({
        flyTo: false,
        selectedDotImage: this.searchDot.current
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

  handleEscape(event) {
    if (event.keyCode === 27) {
      if (this.state.selectedNeighborhood) {
        const marker = this.state.selectedMarkerImage
        marker.src = greenPointer
        this.setState({
          selectedNeighborhood: null,
          selectedMarkerImage: null
        })
      } else if (this.state.selectedAddress) {
        const dot = this.state.selectedDotImage
        dot.src = greenDot
        this.setState({
          selectedDotImage: null,
          selectedAddress: null,
          mouse: false
        })
      }
    }
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

  onCloseNeighborhoodPopup() {
    const marker = this.state.selectedMarkerImage
    marker.src = greenPointer
    this.setState({
      selectedNeighborhood: null,
      selectedMarkerImage: null
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
      searchError,
      addressUserComplaints,
      flyTo
    } = this.state

    const scrollZoom = !selectedMarkerImage && !selectedDotImage

    return (
      <div onKeyUp={this.handleEscape}>
        <MapGL
          id="mapGl"
          ref={this._map}
          scrollZoom={scrollZoom}
          {...viewport}
          width="100vw"
          height="88vh"
          minZoom={11}
          mapStyle={MAP_STYLE}
          interactiveLayerIds={['nyc-neighborhoods-fill']}
          // mapStyle="mapbox://styles/mapbox/streets-v9"
          onClick={this._onClick}
          onViewportChange={v => this.handleViewChange(v)}
          preventStyleDiffing={false}
          ref={map => (this.mapRef = map)}
          mapboxApiAccessToken={token}
          onClick={this.handleMapClick}
          transitionDuration={flyTo ? 2000 : 0}
          transitionInterpolator={flyTo ? new FlyToInterpolator() : null}
        >
          <div style={{display: 'flex'}}>
            <div style={{zIndex: 5}} id="sideSearch">
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
                  ref={this.searchDot}
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
            ) : null}
          </div>
          <div>
            {!boundaryAddresses && neighborhoodComplaints
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
          {/* NEIGHBORHOOD POPUP */}
          {selectedNeighborhood ? (
            <Popup
              closeOnClick={false}
              latitude={this.state.viewport.latitude}
              longitude={this.state.viewport.longitude}
              onClose={this.onCloseNeighborhoodPopup}
              className="popup"
            >
              <NeighborhoodInfoPage data={data} />
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
              <InfoPage
                data={selectedAddress}
                userData={addressUserComplaints}
              />
            </Popup>
          ) : null}
        </MapGL>
      </div>
    )
  }
}

export function renderToDom(container) {
  render(<HomePage />, container)
}

export default withStyles(styles)(HomePage)
