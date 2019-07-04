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
        }
      })

      let obj = {}
      for (let i = 0; i < boundedComplaints.length; i++) {
        if (!obj[boundedComplaints[i].incident_address]) {
          obj[boundedComplaints[i].incident_address] = [boundedComplaints[i]]
        } else {
          obj[boundedComplaints[i].incident_address].push(boundedComplaints[i])
        }
      }

      let addressArray = Object.entries(obj)
      const groupedByAddress = addressArray.map((el, idx) => {
        let newObj = {}
        newObj.id = idx + 1
        newObj.address = el[0]
        newObj.complaints = el[1]
        newObj.latitude = el[1][0].latitude
        newObj.longitude = el[1][0].longitude
        return newObj
      })

      res.send(groupedByAddress)
    } catch (err) {
      next(err)
    }
  }
)
