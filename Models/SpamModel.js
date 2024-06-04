const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");


const attributes = {
    id: {
        type: DataTypes.INTEGER, //  data type integer
        autoIncrement: true, // Auto-increment primary key
        primaryKey: true, // Primary key
    },
    refId: {
        type: DataTypes.INTEGER, // Data type is Integer
        references: {
            model: 'Users', // 'Users' refers to table name
            key: 'id', // 'id' refers to column name in users table
        },
        allowNull: false // not null
    },
    phone: {
        type: DataTypes.STRING, // Data type is String
        allowNull: false, // Not null
    }
}
const options = {
    freezeTableName: true,
    timestamps: false,
};

// Define the User model
const Spam = sequelize.define("Spammers", attributes, options);


// Export the User model
module.exports = Spam;
