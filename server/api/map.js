const router = require('express').Router()
module.exports = router
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/getAll', async (req, res, next) => {
  try {
    const complaintsByHood = await Hood.findAll({
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
          object[hood.complaints[i].type]++
        } else if (!object[hood.complaints[i].complaint_type]) {
          object[hood.complaints[i].type] = 1
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
      return {...complaintObject, complaints: sortedArray}
    })

    res.send(newResult)
  } catch (err) {
    next(err)
  }
})

router.get(
  '/searchByArea/:northLat,:southLat,:westLng,:eastLng',
  async (req, res, next) => {
    console.log('req.params', req.params)
    try {
      const {northLat, southLat, westLng, eastLng} = req.params
      const boundedComplaints = await Complaint.findAll({
        where: {
          latitude: {
            [Op.gt]: [southLat, westLng]
          },
          longitude: {
            [Op.lt]: [northLat, eastLng]
          }
        }
      })
      res.send(boundedComplaints)
    } catch (err) {
      next(err)
    }
  }
)
