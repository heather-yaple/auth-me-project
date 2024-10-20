module.exports = (sequelize, DataTypes) => {
    const Spot = sequelize.define('Spot', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    });

    Spot.associate = models => {
        Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
        Spot.hasMany(models.Review, { foreignKey: 'spotId' });
        Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
    };

    return Spot;
};
