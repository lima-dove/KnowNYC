import React from 'react'

export default class Sidebar extends React.Component {
  constructor(props) {
    super()
  }
  render() {
    const {viewport} = this.props
    return (
      <div className="sidebar">
        <div className="sideText">
          <h3>Welcome to KnowNYC!</h3>
          <p>
            With KnowNYC you can see all 311 incidents filed within the borough
            of Manhattan since 2017.
          </p>
          {viewport < 15.5 ? (
            <div>
              You are currently in <b>Neighborhood view</b>. Click on a marker
              to see the top five 311 incident calls of a neighborhood. Zoom in
              to see Address view.
            </div>
          ) : (
            <div>
              You are currently in <b>Address view</b>. Click on the Search This
              Area button to populate addresses with 311 incident calls, then
              click on markers to see that address' information. Zoom out to see
              Neighborhood view.
            </div>
          )}
          <p>
            You can also use the <b>search bar</b> and the <b>filters</b> below
            to make a custom search.
          </p>
          <p>Filters coming soon!</p>
        </div>
      </div>
    )
  }
}
