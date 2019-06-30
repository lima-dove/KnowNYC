import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import history from '../history'
import {Link as RouterLink} from 'react-router-dom'
import {logout} from '../store'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import {fade, makeStyles} from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import {MemoryRouter as Router} from 'react-router'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import Box from '@material-ui/core/Box'

const style = {
  button: {
    fontSize: '20px',
    color: 'white'
  }
}

const Navbar = ({handleClick, isLoggedIn}) => {
  return (
    <Box boxShadow={2}>
      <AppBar position="static">
        <Toolbar style={{height: '80px'}}>
          <IconButton
            style={{backgroundColor: 'white'}}
            onClick={() => history.push('/home')}
            aria-label="Open drawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </IconButton>
          <Typography
            variant="h3"
            style={{
              margin: 'auto',
              marginRight: '1px',
              paddingLeft: '125px',
              paddingRight: '1px',
              fontFamily: 'Arial Black',
              textShadow:
                '3px 3px 0px rgba(0,0,0,0.1), 7px 7px 0px rgba(0,0,0,0.05)'
            }}
          >
            KNOW
          </Typography>
          <Typography
            variant="h3"
            style={{
              margin: 'auto',
              marginLeft: '1px',
              font: "400 48px/1.5 'Pacifico', Helvetica, sans-serif",
              textShadow:
                '3px 3px 0px rgba(0,0,0,0.1), 7px 7px 0px rgba(0,0,0,0.05)'
            }}
          >
            NYC
          </Typography>

          {isLoggedIn ? (
            <div style={{marginLeft: 'auto'}}>
              <Button
                style={style.button}
                size="large"
                to="/home"
                component={RouterLink}
              >
                Make a complaint
              </Button>
              <Button
                style={style.button}
                to="logout"
                size="large"
                onClick={handleClick}
                component={RouterLink}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div style={{marginLeft: 'auto'}}>
              <Button
                style={style.button}
                to="/login"
                size="large"
                component={RouterLink}
              >
                Login
              </Button>
              <Button
                style={style.button}
                to="/signup"
                size="large"
                component={RouterLink}
              >
                Sign Up
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
