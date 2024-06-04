const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const attributes = {
  id: {
    type: DataTypes.INTEGER, //  data type integer
    autoIncrement: true, // Auto-increment primary key
    primaryKey: true, // Primary key
  },
  name: {
    type: DataTypes.STRING, // Data type is String
    allowNull: false, // Not nullable
  },
  phone: {
    type: DataTypes.STRING, // Data type is String
    unique: true, // Unique constraint
    allowNull: false, // Not nullable
  },
  password: {
    type: DataTypes.STRING, // Data type is String
    allowNull: false, // Not nullable
  },
  email: {
    type: DataTypes.STRING, // Data type is String
    allowNull: true, // Nullable
  },
}

const options = {
  freezeTableName: true,
  timestamps: false,
};

// Define the User model
const Users = sequelize.define("Users", attributes, options);

// Export the User model
module.exports = Users;