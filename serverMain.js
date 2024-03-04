const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const dbConnect = require("./config/dbConnect");

const studentAuthRoutes = require("./routes/authRoutes/studentAuthRoutes/index");
const adminAuthRoutes = require("./routes/authRoutes/adminAuthRoutes/index");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

dotenv.config();

// database connection
dbConnect;

// creating new instace of express
const app = express();

// adding middleware
app.use(express.json());

// handling cors errors
app.use(
  cors({
    origin: "*",
  })
);

// calculating port from .env
let PORT = process.env.PORT || 5001;

// mounting routes
app.use("/api/v1/auth/student", studentAuthRoutes);

app.use("/api/v1/auth/admin", adminAuthRoutes);

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

// app listening
app.listen(PORT, (req, res) => {
  console.log(`Server Running on  => ${PORT}`.underline.yellow);
});

app.get("/", (req, res, next) => {
  res.send("App is running Successfully!");
});

module.exports = app;
