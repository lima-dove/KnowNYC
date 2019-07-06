import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import debounce from 'lodash.debounce'
import React, {Component} from 'react'

const useStyles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
  },
  dropDown: {
    padding: '2px 4px 2px 4px',
    width: 400
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}

//if numbered street, cut 'th' or 'st' off number for DB
const addressSlice = address => {
  const digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const addressArr = address.split(' ')

  if (addressArr.length === 4) {
    let streetName = addressArr[2]

    let hasNum = false
    for (let i = 0; i < digitArray.length; i++) {
      const digit = digitArray[i]
      if (streetName.includes(digit)) hasNum = true
    }

    if (hasNum) streetName = streetName.slice(0, streetName.length - 2)

    addressArr[2] = streetName
  }

  return addressArr.join(' ')
}

export default class MapSearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInput: '',
      autoComplete: null
    }
  }

  handleChange = event => {
    const input = event.target.value

    if (input.length > 3) {
      const autoComplete = debounce(async () => {
        const {data} = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?country=us&limit=3&proximity=-73.977177,40.766132&type=address&access_token=pk.eyJ1IjoibnNjaGVmZXIiLCJhIjoiY2p2Mml0azl1MjVtejQ0bzBmajZhOHViZCJ9.iPyB8tGgsYgboP_fKLQGnw`
        )

        this.setState({
          autoComplete: data
        })
      }, 500)
      autoComplete()
    } else if (input.length === 0) {
      this.setState({
        autoComplete: null
      })
    }

    this.setState({
      searchInput: input
    })
  }

  handleClickSubmit = address => {
    let searchAddress
    if (address) {
      const slicedAddress = address.slice(0, address.indexOf(','))
      searchAddress = addressSlice(slicedAddress).toUpperCase()
    } else {
      searchAddress = addressSlice(this.state.searchInput).toUpperCase()
    }
    this.props.handleSearchSubmit(searchAddress)
    this.setState({
      searchInput: '',
      autoComplete: null
    })
  }

  handleEnterSubmit = event => {
    if (event.keyCode === 13) {
      const capitalAddress = addressSlice(this.state.searchInput).toUpperCase()
      this.props.handleSearchSubmit(capitalAddress)
      this.setState({
        searchInput: '',
        autoComplete: null
      })
    }
  }

  render() {
    const classes = useStyles
    const {searchInput, autoComplete} = this.state
    return (
      <div>
        <Paper style={classes.root}>
          <InputBase
            style={classes.input}
            placeholder="Search KnowNYC"
            inputProps={{'aria-label': 'Search KnowNYC'}}
            onChange={this.handleChange}
            value={searchInput}
            onKeyUp={this.handleEnterSubmit}
          />
          <IconButton
            style={classes.iconButton}
            aria-label="Search"
            onClick={this.handleClickSubmit}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        {autoComplete ? (
          <Paper style={classes.dropDown}>
            {autoComplete.features.map(address => (
              <MenuItem
                key={address.id}
                onClick={() => this.handleClickSubmit(address.place_name)}
                component="div"
                style={{whiteSpace: 'normal'}}
              >
                {address.place_name.slice(
                  0,
                  address.place_name.lastIndexOf(',')
                )}
              </MenuItem>
            ))}
          </Paper>
        ) : null}
      </div>
    )
  }
}
