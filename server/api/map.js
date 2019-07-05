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
      console.log('complaints', boundedComplaints[0])
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

      // let addressArray = Object.entries(obj)
      // const groupedByAddress = addressArray.map((el, idx) => {
      //   let newObj = {}
      //   newObj.id = idx + 1
      //   newObj.address = el[0]
      //   newObj.complaints = el[1]
      //   newObj.latitude = el[1][0].latitude
      //   newObj.longitude = el[1][0].longitude
      //   return newObj
      // })
      // console.log('GROUP===', groupedByAddress[0].complaints[0])

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
      console.log('COORD====', coordinatesArr)
      complaints = await Complaint.findAll({
        where: {
          latitude: Number(coordinatesArr[0]),
          longitude: Number(coordinatesArr[1])
        }
      })
      console.log('complaints========', complaints)
    }
    res.send(complaints)
  } catch (error) {
    next(error)
  }
})
