const router = require('express').Router()
const {User, UserComplaint} = require('../db/models/index')
module.exports = router

router.get('/:location', async (req, res, next) => {
  try {
    let complaints
    let location = req.params.location
    if (location[0] === 'A') {
      const address = location.slice(1)
      complaints = await UserComplaint.findAll({
        where: {
          incident_address: address
        }
      })
    } else {
      let coordinatesArr = location.slice(1).split(',')
      complaints = await UserComplaint.findAll({
        where: {
          latitude: Number(coordinatesArr[0]),
          longitude: Number(coordinatesArr[1])
        }
      })
    }
    res.send(complaints)
  } catch (error) {
    next(error)
  }
})
//add logic to send email with new complaint
router.post('/', async (req, res, next) => {
  try {
    const complaint = await UserComplaint.create(req.body)
    res.send(complaint)
  } catch (error) {
    next(error)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const {id, resolution_description} = req.body
    const [numUpdatedRows, updatedComplaint] = await UserComplaint.update(
      {
        resolved: true,
        resolution_description
      },
      {
        where: {id},
        returning: true
      }
    )
    res.send(updatedComplaint)
  } catch (error) {
    next(error)
  }
})
