const router = require('express').Router()
const {Complaint, Neighborhood} = require('../db/models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

router.get('/getAll', async (req, res, next) => {
  try {
    const complaintsByHood = await Neighborhood.findAll({
      include: [
        {
          model: Complaint,
          as: 'complaints'
        }
      ]
    })
    const result = complaintsByHood.map(hood => {
      let total = 0
      let object = {}
      for (let i = 0; i < hood.complaints.length; i++) {
        if (object[hood.complaints[i].complaint_type]) {
          object[hood.complaints[i].complaint_type]++
        } else if (!object[hood.complaints[i].complaint_type]) {
          object[hood.complaints[i].complaint_type] = 1
        }
        total++
      }
      let newObj = {name: hood.name, complaints: object, total}
      return newObj
    })

    const newResult = result.map((complaintObject, i) => {
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
      res.send(boundedComplaints)
    } catch (err) {
      next(err)
    }
  }
)
