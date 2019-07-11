import React from 'react'
import {connect} from 'react-redux'

class SidebarClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: true
    }
  }

  handleFlyToClick = () => {
    if (this.props.isLoggedIn && this.props.user.subscription_address) {
      const address = this.props.user.subscription_address
      this.props.handleSearchSubmit(address)
    } else {
      this.setState({isLoggedIn: !this.state.isLoggedIn})
    }
  }

  render() {
    const {viewport, onMouseEnter, onMouseLeave} = this.props
    return (
      <div className="sidebar">
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{overflow: 'scroll'}}
          className="sideText"
        >
          <h3>Welcome to KnowNYC!</h3>
          <p>
            With KnowNYC you can see all 311 incidents filed within the borough
            of Manhattan since 2017.
          </p>
          <br />
          <br />
          <br />
          {viewport < 15.5 ? (
            <div>
              <div className="viewIcon">
                <i className="fas fa-city" />
              </div>
              <br />
              <br />
              <br />
              <div>
                You are currently in <b>Neighborhood view</b>. Click on a marker
                to see the top five 311 incident calls of a neighborhood. Zoom
                in to see Address view.
              </div>
            </div>
          ) : (
            <div>
              <div className="viewIcon">
                <i className="fas fa-building" />
              </div>
              <br />
              <br />
              <br />
              <div>
                You are currently in <b>Address view</b>. Click on the Search
                This Area button to populate addresses with 311 incident calls,
                then click on markers to see that address' information. Zoom out
                to see Neighborhood view.
              </div>
            </div>
          )}
          <p>
            You can also use the <b>search bar</b> to make a custom search.
          </p>
          <br />
          <hr />
          <br />
          <br />
          <br />
          <br />
          <i className="far fa-paper-plane" onClick={this.handleFlyToClick} />
          <br />
          <br />
          <br />
          {this.state.isLoggedIn ? null : (
            <small style={{color: 'red'}}>
              You must be logged in and have selected a home address to use this
              feature.
            </small>
          )}
          <p>
            Click on the <b>airplane</b> to fly to your <b>home address</b>.
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: !!state.user.id,
  user: state.user
})

const Sidebar = connect(mapStateToProps, null)(SidebarClass)
export default Sidebar
