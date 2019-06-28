import React from 'react'
import {Navbar} from './components'
import {AppBar} from '@material-ui/core/AppBar'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
