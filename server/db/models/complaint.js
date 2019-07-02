const Sequelize = require('sequelize')
const db = require('../db')

const Complaint = db.define('complaint', {
  created_date: Sequelize.DATE,
  closed_date: Sequelize.DATE,
  complaint_type: Sequelize.STRING,
  descriptor: Sequelize.STRING,
  resolution_description: Sequelize.TEXT,
  incident_address: Sequelize.STRING,
  incident_zip: Sequelize.NUMBER,
  latitude: Sequelize.NUMBER,
  longitude: Sequelize.NUMBER
})

module.exports = Complaint
