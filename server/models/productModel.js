import { DataTypes, Sequelize } from 'sequelize';
import database from '../config/dbConfig.js';

const Product = database.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
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
    outOfStock: {
        type: DataTypes.BOOLEAN
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    freezeTableName: true
});

// (async () => {
//     await database.sync();
// })();

export default Product;