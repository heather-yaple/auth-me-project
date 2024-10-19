'use strict';
let options = { tableName: 'ReviewImages' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      options,
      // 'ReviewImages', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        reviewId: {
          type: Sequelize.INTEGER,
          references: { model: 'Reviews' },
          onDelete: 'cascade',
        },
        url: {
          type: Sequelize.STRING
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
    // options.tableName = "Users";
    await queryInterface.dropTable('ReviewImages');
  }
};