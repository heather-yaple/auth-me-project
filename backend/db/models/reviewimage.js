module.exports = (sequelize, DataTypes) => {
    const ReviewImage = sequelize.define('ReviewImage', {
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Reviews', // References Review table
                key: 'id',
            },
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    ReviewImage.associate = models => {
        ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    };

    return ReviewImage;
};
