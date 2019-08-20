const router = require('express').Router()
module.exports = router
const nodemailer = require('nodemailer')
const User = require('../db/models/user')

router.post('/', async (req, res, next) => {
  try {
    let address = req.body.incident_address.toUpperCase()
    let users = await User.findAll({
      where: {
        subscription_address: address
      }
    })

    let emails = users.map(user => user.dataValues.email)

    const htmlEmail = `
      <h3>New Complaint for the Address: ${address}</h3>
      <ul>
      <li>Complaint Type: ${req.body.complaint_type}</li>
      <li>Description: ${req.body.descriptor}</li>
      <li>Date: ${req.body.created_date}</ul>
       </ul>
       <i>Thank you so much for staying in the Know...NYC</i>`

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'knownyc311@gmail.com',
        pass: 'Capstone123'
      }
    })

    emails.forEach(email => {
      transporter.sendMail(
        {
          from: 'knownyc311@gmail.com',
          to: email,
          subject: `KnowNYC: New complaint for ${address}!`,
          text: `There is a new complaint for ${address}: ${
            req.body.descriptor
          }`,
          html: htmlEmail
        },
        (err, info) => {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            console.log('EMAIL SENT: ' + info.response)
            res.sendStatus(200)
          }
        }
      )
    })
  } catch (err) {
    next(err)
  }
})
