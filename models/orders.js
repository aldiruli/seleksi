'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.hasMany(models.Products, {
        foreignKey: 'orderId',
        as: 'products'
      });
    }
  }

  Orders.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Orders',
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
  });

  return Orders;
};
