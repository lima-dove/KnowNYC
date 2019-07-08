const router = require('express').Router()
const {
  Complaint,
  Neighborhood,
  NeighborhoodAggregate
} = require('../db/models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

router.get('/getAll', async (req, res, next) => {
  try {
    const manhattanHoods = await Neighborhood.findAll({
      where: {boroughId: 3},
      include: NeighborhoodAggregate
    })

    let result = manhattanHoods.map(hood => {
      hood = hood.dataValues
      let complaints = {}
      hood.neighborhood_aggregates.forEach(aggregate => {
        aggregate = aggregate.dataValues
        complaints[aggregate.complaint] = aggregate.frequency
      })
      let newObj = {
        id: hood.id,
        name: hood.name,
        latitude: hood.center_latitude,
        longitude: hood.center_longitude,
        complaints,
        total: hood.total_complaints
      }
      return newObj
    })

    const newResult = result.map(complaintObject => {
      let newArray = Object.entries(complaintObject.complaints)
      let sortedArray = newArray.sort((a, b) => {
        return b[1] - a[1]
      })
      return {...complaintObject, complaints: sortedArray.slice(0, 5)}
    })
    res.send(newResult)
  } catch (err) {
    next(err)
  }
})

router.get(
  '/searchByArea/:northLat,:southLat,:westLng,:eastLng',
  async (req, res, next) => {
    try {
      const {northLat, southLat, westLng, eastLng} = req.params
      const boundedComplaints = await Complaint.findAll({
        where: {
          latitude: {
            [Op.gt]: [Number(southLat)],
            [Op.lt]: [Number(northLat)]
          },
          longitude: {
            [Op.lt]: [Number(eastLng)],
            [Op.gt]: [Number(westLng)]
          }
        },
        attributes: ['id', 'incident_address', 'latitude', 'longitude']
      })
      // Returns an array of objects, each object has 4 properties: 1) address property and 2) complaints property with 2D array: each subelement is comprised of [type, frequency], sorted by frequency 3) latitude property, 4) longtitude property
      let obj = {}
      for (let i = 0; i < boundedComplaints.length; i++) {
        if (!obj[boundedComplaints[i].incident_address]) {
          obj[boundedComplaints[i].incident_address] = boundedComplaints[i]
        }
      }
      let addressArray = []
      for (let key in obj) {
        addressArray.push(obj[key])
      }

      res.send(addressArray)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/getAddress/:location', async (req, res, next) => {
  try {
    let complaints
    let location = req.params.location
    if (location[0] === 'A') {
      const address = location.slice(1)
      complaints = await Complaint.findAll({
        where: {
          incident_address: address
        }
      })
    } else {
      let coordinatesArr = location.slice(1).split(',')
      complaints = await Complaint.findAll({
        where: {
          latitude: Number(coordinatesArr[0]),
          longitude: Number(coordinatesArr[1])
        }
      })
    }
    let aggrObj = {}
    for (let i = 0; i < complaints.length; i++) {
      if (aggrObj[complaints[i].complaint_type]) {
        aggrObj[complaints[i].complaint_type]++
      } else if (!aggrObj[complaints[i].complaint_type]) {
        aggrObj[complaints[i].complaint_type] = 1
      }
    }

    // let aggrArr = Object.entries(aggrObj)
    let aggrArr = []
    for (let key in aggrObj) {
      let dataObj = {}
      dataObj.frequency = aggrObj[key]
      dataObj.type = key
      aggrArr.push(dataObj)
    }

    const addressObj = {
      incident_address: complaints[0].incident_address,
      latitude: complaints[0].latitude,
      longitude: complaints[0].longitude,
      aggregate_data: aggrArr,
      complaints: complaints
    }

    res.send(addressObj)
  } catch (error) {
    next(error)
  }
})
