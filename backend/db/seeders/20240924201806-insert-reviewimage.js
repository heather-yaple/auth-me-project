'use strict';
const { ReviewImage } = require('../models');
const { demoReviewImages } = require('../../utils/demo-data');

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
    for (const reviewImage of demoReviewImages) {
      for (const image of reviewImage.images) {
        ReviewImage.create({
          reviewId: reviewImage.reviewId,
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
    for (const reviewImage of demoReviewImages) {
      for (const image of reviewImage.images) {
        ReviewImage.destroy({
          where: {
            reviewId: reviewImage.reviewId,
            // url: image.url,
            // preview: image.preview || false
          }
        });
      }
    }
  }
};