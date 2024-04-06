const express = require("express")
const router = express.Router()
const {
  executePythonScriptMiddleware,
} = require("../../middlewares/pdfExtraction/index1.js")
const {
  firstYearResult,
  secondYearResult,
  thirdYearResult,
  fourthYearResult,
  retrieve,
} = require("../../controllers/authControllers/studentSchemaControllers/index")
const downloadImageFromCloudinary = require("../../utils/cloudinary")

router.post("/retrieve", retrieve)

router.post(
  "/firstyearresult",
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  firstYearResult
)
router.post(
  "/secondyearresult",
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  secondYearResult
)
router.post(
  "/thirdyearresult",
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  thirdYearResult
)
router.post(
  "/fourthyearresult",
  downloadImageFromCloudinary(),
  executePythonScriptMiddleware,
  fourthYearResult
)

module.exports = router
