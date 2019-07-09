const router = require('express').Router()
const {User, UserComplaint} = require('../db/models/index')
const Sequelize = require('sequelize')
module.exports = router

router.get('/:address', async (req, res, next) => {
  try {
    const complaints = await UserComplaint.findAll({
      where: {
        incident_address: req.params.address
      },
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    res.send(complaints)
  } catch (error) {
    next(error)
  }
})

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
