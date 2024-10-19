'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");
const { demoUsers } = require('../../utils/demo-data');

let options = { tableName: 'Users' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(
      demoUsers, 
      { validate: true }
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    // }, {});
    for (const user of demoUsers) {
      await User.destroy(
        // options,
        { where: { username: user.username } }
      )
    }
  }
};