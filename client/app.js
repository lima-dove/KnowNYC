import React from 'react'
import {Navbar} from './components'
import {AppBar} from '@material-ui/core/AppBar'
import Routes from './routes'
import Box from '@material-ui/core/Box'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
