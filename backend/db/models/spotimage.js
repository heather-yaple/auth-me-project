'use strict';
const {
  Model
} = require('sequelize');
// const { Spot } = require('../models');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // SpotImage.belongsTo(models.Spot);
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'cascade' });
      // SpotImage.belongsTo(models.Spot, { onDelete: 'cascade', hooks: true });
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots' },
      // onDelete: 'cascade',
    },
    url: {
      type: DataTypes.STRING,
    },
    preview: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};