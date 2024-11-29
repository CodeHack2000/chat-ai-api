const dbConfig = require('../../config/dbConfig');

module.exports = (sequelize, DataTypes) => {

    const table = sequelize.define('history', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        userMessage: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        botMessage: {
            type: DataTypes.TEXT,
            allowNull: false
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
        tableName: 'history',
        timestamps: false
    });

    table.associate = (models) => {

        table.belongsTo(models.users, {
            foreignKey: 'userId'
        });
    };

    return table;
};