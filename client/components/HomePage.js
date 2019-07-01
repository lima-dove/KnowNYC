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
      },
      neighborhoodPolyData: null,
      neighborhoodComplaints: null
    }
  }
  async componentDidMount() {
    /* 1. Query GIS information for latitude and longitudes of each neighborhood = an object is returned
    2. Get neighborhood name from object.features[]
    3. Get neighborhood log/lat from object.geometry
    4. Query API within componentDidMount for Manhattan data only
    5. Gather array of objects to state.complants
    */

    const {data} = await axios.get(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nynta/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    )
    let neighborhoodObj = {}

    data.features.forEach(el => {
      const arrStrings = el.geometry.rings[0].map(hood => hood.join(' '))
      const polygonString = arrStrings.join(', ')
      if (neighborhoodObj[el.attributes.BoroName]) {
        neighborhoodObj[el.attributes.BoroName][
          el.attributes.NTAName
        ] = polygonString
      } else {
        neighborhoodObj[el.attributes.BoroName] = {
          [el.attributes.NTAName]: polygonString
        }
      }
    })

    console.log(neighborhoodObj)

    const neighborhoodComplaints = {}
    neighborhoodComplaints.Manhattan = {}

    // eslint-disable-next-line guard-for-in
    for (let neighborhood in neighborhoodObj.Manhattan) {
      let manhattanData = await axios.get(
        `https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$where=within_polygon(location, 'MULTIPOLYGON (((${
          neighborhoodObj.Manhattan[neighborhood]
        })))')`
      )
      console.log({neighborhood})
      console.log({manhattanData})
      neighborhoodComplaints.Manhattan[neighborhood] = manhattanData.data
    }

    this.setState({
      // complaints: data,
      neighborhoodPolyData: neighborhoodObj,
      neighborhoodComplaints
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
    console.log('hood complaints', this.state.neighborhoodComplaints)

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

// Function maybe:
/* Get neighborhood:

*/
