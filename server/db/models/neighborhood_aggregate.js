const Sequelize = require('sequelize')
const db = require('../db')

const NeighborhoodAggregate = db.define('neighborhood_aggregate', {
  complaint: Sequelize.STRING,
  frequency: Sequelize.INTEGER
})

module.exports = NeighborhoodAggregate
