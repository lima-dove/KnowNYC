const Sequelize = require('sequelize')
const db = require('../db')

const Neighborhood = db.define('neighborhood', {
  name: Sequelize.STRING,
  center_latitude: Sequelize.FLOAT,
  center_longitude: Sequelize.FLOAT
})

module.exports = Neighborhood
