const Sequelize = require('sequelize')
const db = require('../db')

const Borough = db.define('borough', {
  name: Sequelize.STRING
})

module.exports = Borough
