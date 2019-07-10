import {Typography} from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React, {Component} from 'react'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '24px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
})

class UserResolutionForm extends Component {
  constructor() {
    super()
    this.state = {
      resolution_description: '',
      error: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  async handleSubmit() {
    const {handleResolveComplaint} = this.props
    const {resolution_description} = this.state

    if (resolution_description === '') {
      this.setState({
        error: true
      })
    } else {
      await handleResolveComplaint(this.state)
      this.setState({
        error: false
      })
    }
  }

  render() {
    const {classes} = this.props
    const {error} = this.state

    return (
      <form className={classes.container} noValidate>
        <TextField
          id="Complaint Resolution"
          label={
            <Typography variant="headline" component="h2">
              Resolution Description
            </Typography>
          }
          style={{margin: 8}}
          error={error}
          placeholder="Resolution here"
          helperText={
            error
              ? 'Resolution description is required to resolve complaint'
              : 'If complaint has been resolved, please explain here'
          }
          fullWidth
          margin="normal"
          variant="outlined"
          multiline={true}
          onChange={this.handleChange('resolution_description')}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="Add"
          className={classes.margin}
          onClick={this.handleSubmit}
        >
          Resolve Complaint
        </Fab>
      </form>
    )
  }
}

export default withStyles(styles)(UserResolutionForm)
