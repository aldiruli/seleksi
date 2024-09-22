'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  Products.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Products',
    timestamps: true,
  });
  
  return Products;
};
