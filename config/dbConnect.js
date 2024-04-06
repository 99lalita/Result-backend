const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const dbPool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

dbPool
  .promise()
  .getConnection()
  .then((result) => {
    console.log("Connection to the Result Database Successful".underline.blue);
  })
  .catch((err) => {
    console.log("Connection is denied");
  });

//   dbPool.query(`select * from student`,(error,result,fields) => {
//     console.log(error);
//     console.log(result);
//     console.log(fields);
//   })

//   dbPool.query(`select first_name from student where admission_year=2021`,(err,result,fields) =>{
//     // console.log(err);
//     console.log(result);
//     // console.log(fields);
//   })

//   dbPool.query(`show tables`,(err,result,fields) => {
//     console.log(fields);
//     console.log(result);
//   })

module.exports = dbPool.promise();
