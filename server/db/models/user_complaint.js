const Sequelize = require('sequelize')
const db = require('../db')

const UserComplaint = db.define('user_complaint', {
  created_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  incident_address: Sequelize.STRING,
  complaint_type: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  descriptor: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true
    }
  },
  resolved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  resolution_description: {
    type: Sequelize.TEXT
  },
  complaint_image: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  resolution_image: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  }
})

module.exports = UserComplaint
