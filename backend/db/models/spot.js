'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of image URLs
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT, // Rating should be a float
        allowNull: true,
        defaultValue: 0, // Default to 0 if no rating exists
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};
