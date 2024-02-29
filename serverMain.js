const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

let port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server exposed on => ${port}`.underline.yellow);
});

module.exports = app;
