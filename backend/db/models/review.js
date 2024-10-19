'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
      // Review.belongsTo(models.Spot);
      Review.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'cascade' });
      // Review.belongsTo(models.Spot, { onDelete: 'cascade', hooks: true });
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' },
      // onDelete: 'CASCADE',
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots' },
      // onDelete: 'cascade',
    },
    review: {
      type: DataTypes.STRING,
    },
    stars: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};