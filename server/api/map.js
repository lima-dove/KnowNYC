const router = require('express').Router()
module.exports = router

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

router.get('/searchByArea', (req, res, next) => {
  try {
    const {northLat, southLat, westLng, eastLng} = req.body
  } catch (err) {
    next(err)
  }
})
