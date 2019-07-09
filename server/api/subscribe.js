/* eslint-disable camelcase */
const router = require('express').Router()
const User = require('../db/models/index')
module.exports = router

router.put('/', async (req, res, next) => {
  const {
    id,
    subscription_address,
    subscription_latitude,
    subscription_longitude
  } = req.body
  try {
    const subscribed = await User.update(
      {subscription_address, subscription_latitude, subscription_longitude},
      {where: {id}}
    )
    console.log({subscribed})
    res.send(subscribed)
  } catch (err) {
    next(err)
  }
})
