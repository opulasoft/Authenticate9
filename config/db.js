
require("dotenv").config();

const { Sequelize } = require('sequelize');

const sequelize  = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.SQL_PORT,
    dialect: process.env.DIALECT,
    dialectOptions: {
      options: { encrypt: false },
    },
  }
);


module.exports.sequelize = sequelize;