const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,  // to store hashed passwords
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Optional: This will remove the password hash from the JSON returned in API responses
    defaultScope: {
      attributes: { exclude: ["hashedPassword"] },
    },
    scopes: {
      withPassword: { attributes: {} },
    }
  });

  // Instance method to check if the provided password matches the hashed password
  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.hashedPassword);
  };

  return User;
};
