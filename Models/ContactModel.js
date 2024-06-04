const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const { eventNames } = require("../server.js");


  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email:{
      type: DataTypes.STRING,
      allowNull:true
    },
    contactOf : {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 'Users' refers to table name
        key: 'id', // 'id' refers to column name in users table
    },
    },
  };

  const options = {
    freezeTableName: true,
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
  };
  const Contacts = sequelize.define("Contacts", attributes, options);

  module.exports = Contacts;