const express = require("express");
const router = express.Router();
const Authorization = require("../../middlewares/authMiddleware/index");
const {
  getResultData,
} = require("../../controllers/AdminAccountControllers/index");

// Route for fetching the result of particular Year for particular batch
router.get("/result/:batchYear/:resultYear", Authorization, getResultData);

module.exports = router;
