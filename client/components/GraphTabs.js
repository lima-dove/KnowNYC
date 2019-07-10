import AppBar from '@material-ui/core/AppBar'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import BarGraph from './BarGraphTest'
import PieChart from './PieChart'

function TabContainer({children, dir}) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
}))

export default function FullWidthTabs(props) {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  function handleChangeIndex(index) {
    setValue(index)
  }

  return (
    <div id="charts" className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Pie Chart" />
          <Tab label="Bar Chart" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          <PieChart data={props.data} />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <BarGraph rawData={props.data} />
        </TabContainer>
      </SwipeableViews>
    </div>
  )
}
