import { DataTypes } from 'sequelize';
import database from '../config/dbConfig.js';

const Accounts = database.define('accounts', {
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    account_username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    account_firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    account_lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    account_pass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    account_contactNo: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    isAccountVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

// (async () => {
//     await database.sync();
// })();

export default Accounts;