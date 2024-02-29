const mysql = require("mysql2");
require("dotenv").config();

const dbPool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

module.exports = dbPool.promise();

// dbPool
//   .promise()
//   .getConnection()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
