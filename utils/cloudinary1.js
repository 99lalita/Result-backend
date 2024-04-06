const axios = require("axios")
const fs = require("fs")
const path = require("path")

// Function to download the file (image/PDF) from Cloudinary
const downloadFile = async (fileUrl, outputFilePath) => {
  try {
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    })

    const writer = fs.createWriteStream(outputFilePath)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(outputFilePath))
      writer.on("error", reject)
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    throw error
  }
}

// Middleware to download file (image/PDF) from Cloudinary
const downloadFileFromCloudinary = () => {
  return async (req, res, next) => {
    try {
      const fileUrl = req.body.fileUrl
      console.log("Downloading file from:", fileUrl)

      // Check if fileUrl is present in the request body
      if (!fileUrl) {
        return res
          .status(400)
          .json({ error: "File URL is missing in request body" })
      }

      // Specify the output file path
      const outputFileName = "downloaded-file"
      const outputFilePath = path.join(
        __dirname,
        "../public/temp",
        outputFileName
      )

      // Download the file from Cloudinary
      await downloadFile(fileUrl, outputFilePath)

      // Attach downloaded file path to request object
      req.downloadedFilePath = outputFilePath
      next()
    } catch (error) {
      console.error("Error in downloadFileFromCloudinary middleware:", error)
      res.status(500).json({ error: "Failed to download file from Cloudinary" })
    }
  }
}

// Export the middleware function
module.exports = downloadFileFromCloudinary
