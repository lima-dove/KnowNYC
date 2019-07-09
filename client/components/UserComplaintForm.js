import {Typography} from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React, {Component} from 'react'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
})

// export default function DatePickers() {

class UserComplaintForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      incident_address: this.props.address,
      created_date: null,
      complaint_type: '',
      descriptor: '',
      resolution_description: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  async handleSubmit(e) {
    await this.props.handleSubmitComplaint(this.state)
  }

  render() {
    const {classes} = this.props

    return (
      <form className={classes.container} noValidate>
        <div>
          <TextField
            onChange={this.handleChange('created_date')}
            id="date"
            label={
              <Typography variant="headline" component="h2">
                Incident Date
              </Typography>
            }
            type="date"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="Complaint Type"
            select
            label={
              <Typography variant="headline" component="h2">
                Complaint Type
              </Typography>
            }
            className={classes.textField}
            value={this.state.type}
            onChange={this.handleChange('complaint_type')}
            SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu
              }
            }}
            helperText="Please select your complaint type"
            margin="normal"
            variant="outlined"
          >
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
          </TextField>
        </div>
        <TextField
          id="Complaint Description"
          label={
            <Typography variant="headline" component="h2">
              Complaint Description
            </Typography>
          }
          style={{margin: 8}}
          placeholder="Description here"
          helperText="Please write a description of your complaint here"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline={true}
          onChange={this.handleChange('descriptor')}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="Complaint Resolution"
          label={
            <Typography variant="headline" component="h2">
              Complaint Resolution
            </Typography>
          }
          style={{margin: 8}}
          placeholder="Resolution here"
          helperText="If complaint has been resolved, please explain here"
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
          Add Complaint
        </Fab>
      </form>
    )
  }
}

export default withStyles(styles)(UserComplaintForm)
