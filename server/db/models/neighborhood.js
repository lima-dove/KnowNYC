const Sequelize = require('sequelize')
const db = require('../db')

const Neighborhood = db.define('neighborhood', {
  name: Sequelize.STRING,
  total_complaints: Sequelize.INTEGER,
  center_latitude: Sequelize.FLOAT,
  center_longitude: Sequelize.FLOAT
})

module.exports = Neighborhood
