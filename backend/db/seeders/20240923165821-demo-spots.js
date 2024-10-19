'use strict';
const { Spot, User } = require('../models');
const { demoSpots } = require('../../utils/demo-data');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    for (const owner of demoSpots) {
      for (const spot of owner.spots) {
        const newSpot = await Spot.create(
          {
            ownerId: owner.ownerId,
            ...spot
          }
        );
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    for (const owner of demoSpots) {
      for (const spot of owner.spots) {
        const newSpot = await Spot.destroy({
          where: { ownerId: owner.ownerId,
            // ...spot
          }
        });
      }
    }
  }
};