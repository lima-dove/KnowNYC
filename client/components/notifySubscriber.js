// Find users:
const subscribedUsers = Users.findAll({
  where: {subscription_address: req.body.incident_address},
  attributes: ['email']
})

Complaints.beforeUpdate()
