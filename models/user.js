'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helper/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastActive: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      birthDate: DataTypes.DATE,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      notification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate(instance, options) {
          instance.password = hashPassword(instance.password);
          instance.lastActive = new Date();
        },
        beforeUpdate(instance, options) {
          instance.password = hashPassword(instance.password);
          instance.lastActive = new Date();
        },
      },

      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
