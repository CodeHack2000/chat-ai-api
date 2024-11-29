'use strict';

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
            tableName: 'session',
            timestamps: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('session');
    }
};
