const express = require("express");
const router = express.Router();
const {
  executePythonScriptMiddleware,
} = require("../../middlewares/pdfExtraction/index1.js");
const {
  firstYearResult,
  secondYearResult,
  thirdYearResult,
  fourthYearResult,
  retrieve,
  updateStudentPassword,
} = require("../../controllers/authControllers/studentSchemaControllers/index");
const downloadImageFromCloudinary = require("../../utils/cloudinary");
const Authorization = require("../../middlewares/authMiddleware/index.js");

router.post("/retrieve/:year", Authorization, retrieve);

router.post(
  "/firstyearresult",
  Authorization,
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  firstYearResult
);
router.post(
  "/secondyearresult",
  Authorization,
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  secondYearResult
);
router.post(
  "/thirdyearresult",
  Authorization,
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  thirdYearResult
);
router.post(
  "/fourthyearresult",
  Authorization,
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  fourthYearResult
);

router.post("/UpdatePassword", Authorization, updateStudentPassword);

module.exports = router;
