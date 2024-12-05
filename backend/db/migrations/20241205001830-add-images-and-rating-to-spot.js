'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'images' as a TEXT column that will store a JSON string of image URLs
    await queryInterface.addColumn('Spots', 'images', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add 'rating' as a FLOAT column
    await queryInterface.addColumn('Spots', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Spots', 'images');
    await queryInterface.removeColumn('Spots', 'rating');
  }
};

