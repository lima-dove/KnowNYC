const User = require('./user')
const Borough = require('./borough')
const Neighborhood = require('./neighborhood')
const Complaint = require('./complaint')
const NeighborhoodAggregate = require('./neighborhood_aggregate')
const UserComplaint = require('./user_complaint')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
Borough.hasMany(Neighborhood)
Neighborhood.belongsTo(Borough)
Neighborhood.hasMany(Complaint)
Complaint.belongsTo(Neighborhood)
Neighborhood.hasMany(NeighborhoodAggregate)
NeighborhoodAggregate.belongsTo(Neighborhood)
User.hasMany(UserComplaint)
UserComplaint.belongsTo(User)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Borough,
  Neighborhood,
  NeighborhoodAggregate,
  Complaint,
  UserComplaint
}
