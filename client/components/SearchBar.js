import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import SearchIcon from '@material-ui/icons/Search'
import React, {Component} from 'react'

const useStyles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
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

export default class MapSearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInput: ''
    }
  }

  handleChange = event => {
    const input = event.target.value
    this.setState({
      searchInput: input
    })
  }

  handleSubmit = event => {
    event.nativeEvent.stopImmediatePropagation()
    const capitalAddress = this.state.searchInput.toUpperCase()
    this.props.handleSearchSubmit(capitalAddress)
    this.setState({
      searchInput: ''
    })
  }

  render() {
    console.log('STATE', this.state)
    const classes = useStyles
    return (
      <Paper style={classes.root} fullWidth={true}>
        <InputBase
          style={classes.input}
          placeholder="Search KnowNYC"
          inputProps={{'aria-label': 'Search KnowNYC'}}
          onChange={this.handleChange}
          value={this.state.searchInput}
        />
        <IconButton
          style={classes.iconButton}
          aria-label="Search"
          onClick={this.handleSubmit}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    )
  }
}
