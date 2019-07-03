const Sequelize = require('sequelize')
const db = require('../db')

const Neighborhood = db.define('neighborhood', {
  name: Sequelize.STRING
})

module.exports = Neighborhood
