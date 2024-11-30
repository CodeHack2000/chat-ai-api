const dbConfig = require('../../config/dbConfig');

module.exports = (sequelize, DataTypes) => {

    const table = sequelize.define('users', {

        id: {

            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {

            type: DataTypes.STRING,
            allowNull: false
        },
        email: {

            type: DataTypes.STRING,
            allowNull: false
        },
        password: {

            type: DataTypes.TEXT
        },
        avatar: {

            type: DataTypes.BLOB
        },
        googleId: {

            type: DataTypes.STRING
        },
        emailValidationState: {

            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'notValidated'
        },
        profile: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USER'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE
        },
    }, {
        schema: dbConfig.schema,
        tableName: 'users',
        timestamps: false
    });

    return table;
};