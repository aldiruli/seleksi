'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'orderId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'orderId');
  }
};
