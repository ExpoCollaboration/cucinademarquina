// Import necessary modules from Sequelize
import { DataTypes, Sequelize } from 'sequelize';

// Import the Sequelize instance configured for the database
import database from '../config/dbConfig.js';

// Define the 'Item' model using Sequelize
const Item = database.define('item', {
    // Define columns of the 'item' table
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
     // Define additional configurations for the 'Item' model
    freezeTableName: true,
});

// (async () => {
//     await database.sync();
// })();

export default Item;