/* eslint-disable max-statements */
/* eslint-disable complexity */
import {Button} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import {fade, withStyles} from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import FullWidthTabs from './GraphTabs'
import {UserComplaintForm} from './index'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import {connect} from 'react-redux'
import {subscribe} from '../store'
import UserResolutionForm from './UserResolutionForm'

function TabContainer({children, dir}) {
  return (
    <Typography component="div" dir={dir} style={{padding: 8 * 3}}>
      {children}
    </Typography>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
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
  },
  paperTable: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  tableTable: {
    minWidth: 650,
    overflowX: 'auto'
  },
  tabDirection: {
    direction: theme.direction
  },
  button: {
    margin: theme.spacing(1),
    justifySelf: 'center'
  }
})

class InfoPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      complaints: [],
      userComplaints: [],
      allComplaints: [],
      address: '',
      tabValue: 0,
      addComplaints: false,
      isLoggedIn: true,
      subscribedAddress: null
      resolveComplaint: null
    }

    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleChangeIndex = this.handleChangeIndex.bind(this)
    this.handleSubmitComplaint = this.handleSubmitComplaint.bind(this)
    this.handleResolveComplaint = this.handleResolveComplaint.bind(this)
  }

  componentDidMount() {
    const {data, userData} = this.props

    const allComplaints = data.complaints.concat(userData)

    this.setState({
      complaints: data.complaints,
      address: data.incident_address,
      userComplaints: userData,
      allComplaints
    })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data.complaints[0].incident_address !==
      this.props.data.complaints[0].incident_address
    ) {
      this.setState({
        address: this.props.data.complaints[0].incident_address,
        complaints: this.props.data.complaints
      })
    }
    this.swipeableActions.updateHeight()
  }

  handleTabChange(event, newValue) {
    this.setState({tabValue: newValue})
  }

  createDate(date) {
    return date.slice(0, 10)
  }

  handleChangeIndex(index) {
    this.setState({tabValue: index})
  }

  async handleSubmitComplaint(info) {
    const {allComplaints, userComplaints} = this.state
    if (info.resolution_description !== '') {
      info.resolved = true
    }
    const {data} = await axios.post('/api/user-complaint', info)

    this.setState({
      allComplaints: [...allComplaints, data],
      userComplaints: [...userComplaints, data],
      addComplaints: false
    })
  }

  async handleResolveComplaint(info) {
    const {allComplaints, userComplaints, resolveComplaint} = this.state

    info.id = resolveComplaint.id

    const {data} = await axios.put('/api/user-complaint', info)

    const allComplaintsCopy = allComplaints.filter(
      el => el.id !== resolveComplaint.id
    )
    const userComplaintsCopy = userComplaints.filter(
      el => el.id !== resolveComplaint.id
    )

    this.setState({
      allComplaints: [...allComplaintsCopy, data[0]],
      userComplaints: [...userComplaintsCopy, data[0]],
      resolveComplaint: null
    })
  }

  renderAddress(address) {
    address = address.replace(/ +(?= )/g, '')
    address = address
      .toLowerCase()
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    let th = [0, 4, 5, 6, 7, 8, 9]
    let st = [1]
    let nd = [2]
    let rd = [3]
    let splitAddress = address.split(' ')
    if (splitAddress.length === 3) {
      if (Number(splitAddress[1])) {
        if (th.includes(Number(splitAddress[1][splitAddress[1].length - 1]))) {
          let newSecond = splitAddress[1] + 'th'
          splitAddress[1] = newSecond
          return splitAddress.join(' ')
        } else if (
          st.includes(Number(splitAddress[1][splitAddress[1].length - 1]))
        ) {
          let newSecond = splitAddress[1] + 'st'
          splitAddress[1] = newSecond
          return splitAddress.join(' ')
        } else if (
          nd.includes(Number(splitAddress[1][splitAddress[1].length - 1]))
        ) {
          let newSecond = splitAddress[1] + 'nd'
          splitAddress[1] = newSecond
          return splitAddress.join(' ')
        } else if (
          rd.includes(Number(splitAddress[1][splitAddress[1].length - 1]))
        ) {
          let newSecond = splitAddress[1] + 'rd'
          splitAddress[1] = newSecond
          return splitAddress.join(' ')
        }
      } else {
        return address
      }
    } else if (splitAddress.length === 4) {
      if (Number(splitAddress[2])) {
        if (th.includes(Number(splitAddress[2][splitAddress[2].length - 1]))) {
          let newSecond = splitAddress[2] + 'th'
          splitAddress[2] = newSecond
          return splitAddress.join(' ')
        } else if (
          st.includes(Number(splitAddress[2][splitAddress[2].length - 1]))
        ) {
          let newSecond = splitAddress[2] + 'st'
          splitAddress[2] = newSecond
          return splitAddress.join(' ')
        } else if (
          nd.includes(Number(splitAddress[2][splitAddress[2].length - 1]))
        ) {
          let newSecond = splitAddress[2] + 'nd'
          splitAddress[2] = newSecond
          return splitAddress.join(' ')
        } else if (
          rd.includes(Number(splitAddress[2][splitAddress[2].length - 1]))
        ) {
          let newSecond = splitAddress[2] + 'rd'
          splitAddress[2] = newSecond
          return splitAddress.join(' ')
        }
      } else {
        return address
      }
    } else if (splitAddress.length === 2) {
      if (Number(splitAddress[0])) {
        if (th.includes(Number(splitAddress[0][splitAddress[0].length - 1]))) {
          let newSecond = splitAddress[0] + 'th'
          splitAddress[0] = newSecond
          return splitAddress.join(' ')
        } else if (
          st.includes(Number(splitAddress[0][splitAddress[0].length - 1]))
        ) {
          let newSecond = splitAddress[0] + 'st'
          splitAddress[0] = newSecond
          return splitAddress.join(' ')
        } else if (
          nd.includes(Number(splitAddress[0][splitAddress[0].length - 1]))
        ) {
          let newSecond = splitAddress[0] + 'nd'
          splitAddress[0] = newSecond
          return splitAddress.join(' ')
        } else if (
          rd.includes(Number(splitAddress[0][splitAddress[0].length - 1]))
        ) {
          let newSecond = splitAddress[0] + 'rd'
          splitAddress[0] = newSecond
          return splitAddress.join(' ')
        }
      } else {
        return address
      }
    } else {
      return address
    }
  }

  handleSubscribeClick = () => {
    if (this.props.isLoggedIn) {
      this.props.subscribe(
        this.props.user.id,
        this.state.address,
        this.props.data.latitude,
        this.props.data.longitude
      )
      this.setState({subscribedAddress: this.state.address})
      console.log('subscribed click ', this.state.subscribedAddress)
    } else {
      this.setState({isLoggedIn: this.props.isLoggedIn})
    }
  }

  render() {
    const {classes, data} = this.props
    const {addComplaints, resolveComplaint} = this.state
    const displayAddress = this.state.address
      ? this.renderAddress(this.state.address)
      : `[${data.latitude}, ${data.longitude}]`

    return (
      <div style={{backgroundColor: 'lightgrey'}}>
        <br />
        <Container>
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  align="center"
                  className={classes.title}
                  variant="h6"
                  noWrap
                >
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>Data for {displayAddress}</div>
                    <div>
                      <Button
                        onClick={this.handleSubscribeClick}
                        variant="contained"
                        className={classes.button}
                        style={{zIndex: '10'}}
                      >
                        <div>
                          <p style={{marginBottom: '1px', marginTop: '1px'}}>
                            Subscribe to this address
                          </p>
                          {!this.state.isLoggedIn ? (
                            <small style={{color: 'red', margin: '0'}}>
                              You must be logged in to use this feature
                            </small>
                          ) : null}
                          {this.state.subscribedAddress ? (
                            <small style={{color: 'red', margin: '0'}}>
                              {`You are now subscribed to ${this.renderAddress(
                                this.state.subscribedAddress
                              )}`}
                            </small>
                          ) : null}
                        </div>
                      </Button>
                    </div>
                  </div>
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <br />
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <FullWidthTabs data={this.props.data.aggregate_data} />
          </div>
          <br />
          <Paper className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                scrollButtons="on"
              >
                <Tab label="All Complaints" />
                <Tab label="311 Complaints" />
                <Tab label="User Complaints" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              enableMouseEvents
              action={actions => {
                this.swipeableActions = actions
              }}
              axis={
                classes.tabDirection.direction === 'rtl' ? 'x-reverse' : 'x'
              }
              index={this.state.tabValue}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={classes.tabDirection.direction}>
                {resolveComplaint ? (
                  <div>
                    <Fab
                      color="secondary"
                      style={{marginBottom: '10px'}}
                      aria-label="Add"
                      className={classes.fab}
                      onClick={() => this.setState({resolveComplaint: null})}
                    >
                      <RemoveIcon />
                    </Fab>
                    <UserResolutionForm
                      handleResolveComplaint={this.handleResolveComplaint}
                    />
                  </div>
                ) : null}
                <Paper className={classes.paperTable}>
                  <Table className={classes.tableTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Date of Complaint</TableCell>
                        <TableCell align="center">Complaint Type</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Resolution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.allComplaints
                        .sort((a, b) => {
                          return (
                            new Date(b.created_date) - new Date(a.created_date)
                          )
                        })
                        .map(complaint => {
                          return (
                            <TableRow key={complaint.id}>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {this.createDate(complaint.created_date)}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.complaint_type}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.descriptor}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.resolution_description ? (
                                  complaint.resolution_description
                                ) : (
                                  <Button
                                    onClick={() =>
                                      this.setState({
                                        resolveComplaint: complaint
                                      })
                                    }
                                    variant="contained"
                                    className={classes.button}
                                    style={{zIndex: '10'}}
                                  >
                                    Resolve This Complaint
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              </TabContainer>
              <TabContainer dir={classes.tabDirection.direction}>
                <Paper className={classes.paperTable}>
                  <Table className={classes.tableTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Date of Complaint</TableCell>
                        <TableCell align="center">Complaint Type</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Resolution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.complaints
                        .sort((a, b) => {
                          return (
                            new Date(b.created_date) - new Date(a.created_date)
                          )
                        })
                        .map(complaint => {
                          return (
                            <TableRow key={complaint.id}>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {this.createDate(complaint.created_date)}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.complaint_type}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.descriptor}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.resolution_description}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              </TabContainer>
              <TabContainer dir={classes.tabDirection.direction}>
                {!resolveComplaint ? (
                  <Fab
                    color={addComplaints ? 'secondary' : 'primary'}
                    style={{marginBottom: '10px'}}
                    aria-label="Add"
                    className={classes.fab}
                    onClick={() =>
                      this.setState({addComplaints: !addComplaints})
                    }
                  >
                    {addComplaints ? <RemoveIcon /> : <AddIcon />}
                  </Fab>
                ) : null}
                {this.state.addComplaints ? (
                  <UserComplaintForm
                    address={this.state.address}
                    handleSubmitComplaint={this.handleSubmitComplaint}
                  />
                ) : null}
                {resolveComplaint ? (
                  <div>
                    <Fab
                      color="secondary"
                      style={{marginBottom: '10px'}}
                      aria-label="Add"
                      className={classes.fab}
                      onClick={() => this.setState({resolveComplaint: null})}
                    >
                      <RemoveIcon />
                    </Fab>
                    <UserResolutionForm
                      handleResolveComplaint={this.handleResolveComplaint}
                    />
                  </div>
                ) : null}
                <Paper className={classes.paperTable}>
                  <Table className={classes.tableTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Date of Complaint</TableCell>
                        <TableCell align="center">Complaint Type</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Resolution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.userComplaints
                        .sort((a, b) => {
                          return (
                            new Date(b.created_date) - new Date(a.created_date)
                          )
                        })
                        .map(complaint => {
                          return (
                            <TableRow key={complaint.id}>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {this.createDate(complaint.created_date)}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.complaint_type}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.descriptor}
                              </TableCell>
                              <TableCell align="center">
                                {complaint.resolution_description ? (
                                  complaint.resolution_description
                                ) : (
                                  <Button
                                    onClick={() =>
                                      this.setState({
                                        resolveComplaint: complaint
                                      })
                                    }
                                    variant="contained"
                                    className={classes.button}
                                    style={{zIndex: '10'}}
                                  >
                                    Resolve This Complaint
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              </TabContainer>
            </SwipeableViews>
            <br />
          </Paper>
        </Container>
      </div>
    )
  }
}

InfoPage.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  isLoggedIn: !!state.user.id,
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    subscribe: (id, addr, lat, lon) => dispatch(subscribe(id, addr, lat, lon))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(InfoPage)
)
