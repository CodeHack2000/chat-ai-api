'use strict';

const dbConfig = require('../../config/dbConfig');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            { tableName: 'users', schema: dbConfig.schema },
            'profiles', 
            {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
                defaultValue: ['USER']
            }
        );
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn(
            { tableName: 'users', schema: dbConfig.schema },
            'profiles'
        );
    }
};
