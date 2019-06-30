import React, {Fragment} from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LineGraph from './LineGraph'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import {fade, withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import PropTypes from 'prop-types'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import PhoneIcon from '@material-ui/icons/Phone'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PersonPinIcon from '@material-ui/icons/PersonPin'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      '&:focus': {
        width: 300
      }
    }
  },
  tabs: {
    flexGrow: 1
  }
})

class InfoPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      complaints: [],
      address: '',
      long: '',
      lat: '',
      lineGraphData: {},
      barChartData: {},
      tabValue: 0
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }
  async componentDidMount() {
    const {data} = await axios.get(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$limit=100'
    )
    this.setState({
      complaints: data,
      address: data[0].incident_address,
      long: data[0].location.coordinates[0],
      lat: data[0].location.coordinates[1]
    })
    let lineGraphData = {}
    let barChartData = {}
    this.state.complaints.forEach(complaint => {
      const complaintType = complaint.complaint_type
      if (barChartData[complaintType]) {
        barChartData[complaintType]++
      } else {
        barChartData[complaintType] = 1
      }
    })
    this.state.complaints.forEach(complaint => {
      const year = Number(complaint.created_date.slice(0, 4))
      if (lineGraphData[year]) {
        lineGraphData[year]++
      } else {
        lineGraphData[year] = 1
      }
    })
    let keys = Object.keys(lineGraphData)
    let lineGraphProps = keys.map(key => {
      return [key, lineGraphData[key]]
    })
    this.setState({barChartData: barChartData, lineGraphData: lineGraphProps})
    console.log(
      'BAR CHART DATA:',
      this.state.barChartData,
      'LINE GRAPH DATA:',
      this.state.lineGraphData
    )
  }
  handleTabChange(event, newValue) {
    this.setState({tabValue: newValue})
  }
  render() {
    const {classes} = this.props

    return (
      <div style={{backgroundColor: 'lightgrey'}}>
        <br />
        <Container>
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                  Graph data for...
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search for new address"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{'aria-label': 'Search'}}
                  />
                </div>
              </Toolbar>
            </AppBar>
          </div>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <LineGraph />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <LineGraph />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <br />
          <Paper className={classes.root}>
            <Tabs
              value={this.state.tabValue}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="All Complaints" />
              <Tab label="311 Complaints" />
              <Tab label="User Complaints" />
            </Tabs>
          </Paper>
        </Container>
        <br />
      </div>
    )
  }
}

InfoPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InfoPage)
