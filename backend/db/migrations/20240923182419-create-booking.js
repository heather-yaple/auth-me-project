'use strict';
let options = { tableName: 'Bookings' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      options,
      // 'Bookings', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        spotId: {
          type: Sequelize.INTEGER,
          references: { model: 'Spots' },
          onDelete: 'cascade',
        },
        userId: {
          type: Sequelize.INTEGER,
          references: { model: 'Users' },
          onDelete: 'cascade',
        },
        startDate: {
          type: Sequelize.DATE
        },
        endDate: {
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      // options
    );
  },
  async down(queryInterface, Sequelize) {
    // options.tableName = "Bookings";
    await queryInterface.dropTable('Bookings', options);
  }
};