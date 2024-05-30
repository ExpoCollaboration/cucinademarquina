// Import necessary modules from Sequelize
import { DataTypes, Sequelize } from 'sequelize';

// Import the Sequelize instance configured for the database
import database from '../config/dbConfig.js';

const Transaction = database.define('transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    overallTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    freezeTableName: true,
});

// (async () => {
//     await database.sync();
// })();

export default Transaction;