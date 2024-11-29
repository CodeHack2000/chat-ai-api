'use strict';

const dbConfig = require('../../config/dbConfig');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('history', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            userMessage: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            botMessage: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE
            },
        }, {
            schema: dbConfig.schema,
            tableName: 'users',
            timestamps: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('history');
    }
};
