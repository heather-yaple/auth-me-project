'use strict';
let options = { tableName: 'Spots' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      options,
      // 'Spots', 
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', as: 'Owner' },
          onDelete: 'cascade',
        },
        address: {
          type: Sequelize.TEXT,
        },
        city: {
          type: Sequelize.TEXT
        },
        state: {
          type: Sequelize.TEXT
        },
        country: {
          type: Sequelize.TEXT
        },
        lat: {
          type: Sequelize.FLOAT
        },
        lng: {
          type: Sequelize.FLOAT
        },
        name: {
          type: Sequelize.TEXT
        },
        description: {
          type: Sequelize.TEXT
        },
        price: {
          type: Sequelize.FLOAT
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
    await queryInterface.addIndex(
      options,
      // 'Spots',
      ['address', 'city', 'state', 'country'],
      {
        unique: true,
        // ...options
      }
    )
  },
  async down(queryInterface, Sequelize) {
    // options.tableName = "Spots";
    await queryInterface.dropTable('Spots');
  }
};