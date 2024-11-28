/* eslint-disable no-unused-vars */
const dbConfig = require('../../config/dbConfig');

module.exports = (sequelize, DataTypes, _) => {

    const table = sequelize.define('session', {

        sid: {
            type: DataTypes.TEXT,
            primaryKey: true
        },
        sess: {
            type: DataTypes.JSON
        },
        expire: {
            type: DataTypes.DATE
        }
    }, {
        schema: dbConfig.schema,
        tableName: 'session',
        timestamps: false
    });

    return table;
};
