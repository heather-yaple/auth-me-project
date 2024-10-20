module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
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
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    Booking.associate = models => {
        Booking.belongsTo(models.User, { foreignKey: 'userId' });
        Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    };

    return Booking;
};
