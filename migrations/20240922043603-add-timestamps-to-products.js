'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if the columns already exist
        const [results] = await queryInterface.sequelize.query(`
            SELECT COUNT(*) AS count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Products' 
            AND COLUMN_NAME IN ('createdAt', 'updatedAt')
        `);

        if (results[0].count === 0) {
            await queryInterface.addColumn('Products', 'createdAt', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            });
            await queryInterface.addColumn('Products', 'updatedAt', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Products', 'createdAt');
        await queryInterface.removeColumn('Products', 'updatedAt');
    }
};
