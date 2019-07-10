import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Link as RouterLink} from 'react-router-dom'
import {auth} from '../store'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

/**
 * COMPONENT
 */
const Login = props => {
  const {name, displayName, handleSubmit, error} = props
  const classes = useStyles()

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="div">
          <Box
            textAlign="center"
            fontWeight={500}
            fontStyle="oblique"
            lineHeight={5}
          >
            {error &&
              error.response && (
                <Typography variant="p"> {error.response.data} </Typography>
              )}
          </Box>
        </Typography>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {displayName}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} name={name}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            className={classes.submit}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {displayName}
          </Button>
          <Grid container>
            <Grid item xs={4}>
              <Link component="" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Link component={RouterLink} to="/signUp" variant="body2">
                Don't have an account?{`\n`}Sign up
              </Link>
            </Grid>
            <Grid item />
            <Grid item xs={4}>
              <Link href="/auth/google">{displayName} with Google</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value.toLowerCase()
      const password = evt.target.password.value
      dispatch(auth(email, password, null, null, null, formName))
    }
  }
}

export default connect(mapLogin, mapDispatch)(Login)

/**
 * PROP TYPES
 */
Login.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
