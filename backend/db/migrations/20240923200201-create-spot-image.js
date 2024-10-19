'use strict';
let options = { tableName: 'SpotImages' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      options,
      // 'SpotImages', 
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
        url: {
          type: Sequelize.STRING
        },
        preview: {
          type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('SpotImages');
  }
};