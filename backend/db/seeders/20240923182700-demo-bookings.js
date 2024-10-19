'use strict';
const { Booking } = require('../models');
const { demoBookings } = require('../../utils/demo-data');
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
    for (const booking of demoBookings) {
      booking.startDate = new Date(booking.startDate + 'T15:00:00');
      booking.endDate = new Date(booking.endDate + 'T11:00:00');
      const newBooking = await Booking.create(booking);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const booking of demoBookings) {
      booking.startDate = new Date(booking.startDate + 'T15:00:00');
      booking.endDate = new Date(booking.endDate + 'T11:00:00');
      const newBooking = await Booking.destroy({
        where: booking
      });
    }
  }
};