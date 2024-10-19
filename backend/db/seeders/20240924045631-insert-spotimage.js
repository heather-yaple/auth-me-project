'use strict';
const { SpotImage } = require('../models');
const { demoSpotImages } = require('../../utils/demo-data');

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
    for (const spotImages of demoSpotImages) {
      for (const image of spotImages.images) {
        SpotImage.create({
          spotId: spotImages.spotId,
          url: image.url,
          preview: image.preview || false
        });
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
    for (const spotImages of demoSpotImages) {
      for (const image of spotImages.images) {
        SpotImage.destroy({
          where: {
            spotId: spotImages.spotId,
            url: image.url,
            preview: image.preview || false
          }
        });
      }
    }
  }
};