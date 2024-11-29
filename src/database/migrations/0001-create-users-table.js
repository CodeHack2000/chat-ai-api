'use strict';

const dbConfig = require('../../config/dbConfig');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.TEXT
            },
            avatar: {
                type: Sequelize.BLOB
            },
            googleId: {
                type: Sequelize.STRING
            },
            emailValidationState: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'notValidated'
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
        return queryInterface.dropTable('users');
    }
};
