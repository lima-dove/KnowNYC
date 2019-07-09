/* eslint-disable camelcase */
const router = require('express').Router()
const {User} = require('../db/models/index')
module.exports = router

router.put('/', async (req, res, next) => {
  console.log('req.body in subscribe: ', req.body)
  const {
    id,
    subscription_address,
    subscription_latitude,
    subscription_longitude
  } = req.body
  try {
    const subscribed = await User.update(
      {subscription_address, subscription_latitude, subscription_longitude},
      {where: {id}, returning: true, plain: true}
    )
    res.send(subscribed[1].dataValues)
  } catch (err) {
    next(err)
  }
})
