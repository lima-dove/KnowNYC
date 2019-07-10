// import MAP_STYLE from '../../map-style-basic-v8.json'
import MAP_STYLE from '../map-style-basic-v9.json'
import NYC_NEIGHBORHOODS from './mapdata.json'

const mapStyle = {
  ...MAP_STYLE,
  sources: {...MAP_STYLE.sources},
  layers: MAP_STYLE.layers.slice()
}

mapStyle.sources['nyc-neighborhoods'] = {
  type: 'geojson',
  data: NYC_NEIGHBORHOODS
}
mapStyle.layers.push(
  {
    id: 'nyc-neighborhoods-fill',
    source: 'nyc-neighborhoods',
    type: 'fill',
    interactive: true,
    paint: {
      'fill-outline-color': '#0040c8',
      'fill-color': '#fff',
      'fill-opacity': 0
    }
  },
  {
    id: 'nyc-neighborhoods-outline',
    source: 'nyc-neighborhoods',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': '#0080ef'
    }
  }
)

export default mapStyle
