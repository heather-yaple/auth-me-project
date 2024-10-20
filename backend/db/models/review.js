module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // References User table
                key: 'id',
            },
        },
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Spots', // References Spot table
                key: 'id',
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
    });

    Review.associate = models => {
        Review.belongsTo(models.User, { foreignKey: 'userId' });
        Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
        Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });
    };

    return Review;
};
