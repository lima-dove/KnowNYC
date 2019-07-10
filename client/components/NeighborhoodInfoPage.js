import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import {fade, withStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import FullWidthTabs from './GraphTabs'

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
    width: '100%',
    justifyContent: 'center'
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
    minWidth: 650
  },
  tabDirection: {
    direction: theme.direction
  }
})

class InfoPage extends React.Component {
  render() {
    const {classes, theme} = this.props
    const {data} = this.props

    return (
      <div style={{backgroundColor: 'lightgrey'}}>
        <br />
        <Container>
          <div className={classes.root}>
            <AppBar
              position="static"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                  Data for {data.name}
                </Typography>
              </Toolbar>
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                  Total Complaints for {data.name}: {data.total}
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <br />
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <FullWidthTabs data={data.aggregate_data} />
          </div>
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
