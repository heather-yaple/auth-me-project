'use strict';
let options = { tableName: 'Reviews' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      options,
      // 'Reviews', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Spots' },
          onDelete: 'cascade',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users' },
          onDelete: 'cascade',
        },
        review: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        stars: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    // options.tableName = "Reviews";
    await queryInterface.dropTable('Reviews', options);
  }
};