'use strict';

const dbConfig = require('../../config/dbConfig');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('session', {
            sid: {
                type: Sequelize.TEXT,
                primaryKey: true
            },
            sess: {
                type: Sequelize.JSON
            },
            expire: {
                type: Sequelize.DATE
            }
        }, {
            schema: dbConfig.schema,
            tableName: 'session',
            timestamps: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('session');
    }
};
