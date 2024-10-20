module.exports = (sequelize, DataTypes) => {
    const SpotImage = sequelize.define('SpotImage', {
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Spots', // References Spot table
                key: 'id',
            },
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preview: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    SpotImage.associate = models => {
        SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
    };

    return SpotImage;
};
