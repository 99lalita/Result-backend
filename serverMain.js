const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const dbConnect = require("./config/dbConnect");

const studentAuthRoutes = require("./routes/authRoutes/studentAuthRoutes/index");
const adminAuthRoutes = require("./routes/authRoutes/adminAuthRoutes/index");
const studentAccountRoutes = require("./routes/studentAccountRoutes/index");
const adminAccountRoutes = require("./routes/AdminAccountRoutes/index");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

// database connection
dbConnect;

// creating new instace of express
const app = express();

// handling cors errors
app.use(
  cors({
    origin: "*",
  })
);

// adding middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// load config from env file
dotenv.config({
  path: "./.env",
});

// calculating port from .env
let PORT = process.env.PORT || 5001;

// default route
app.get("/", (req, res, next) => {
  res.send("App is running Successfully!");
});

// mounting routes for authentication and authorization
app.use("/api/v1/auth/student", studentAuthRoutes);
app.use("/api/v1/auth/admin", adminAuthRoutes);

//mounting account routes for student and admin
app.use("/api/v2/student/result", studentAccountRoutes);
app.use("/api/v2/admin/account", adminAccountRoutes);

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

// app listening
app.listen(PORT, (req, res) => {
  // console.log(PORT);
  console.log(`Server Running on  => ${PORT}`.underline.yellow);
});

module.exports = app;
