'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Booking.belongsTo(models.User);
      // Booking.belongsTo(models.Spot);
      Booking.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'cascade' });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots' },
      // onDelete: 'cascade', // commented: foreign key constraint error, uncommented: sqlite_readonly error
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' },
      // onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};