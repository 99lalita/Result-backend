const axios = require("axios");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Function to download the file
const downloadFile = async (fileUrl, outputFilePath) => {
  try {
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(outputFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(outputFilePath));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

// Middleware to download file from Cloudinary
const downloadFileFromCloudinary = () => {
  return async (req, res, next) => {
    try {
      // Retrieve file URL from request body
      const fileUrl = req.body.resultPDF;

      if (!fileUrl) {
        return res
          .status(400)
          .json({ error: "File URL is missing in request body" });
      }

      console.log("Downloading file from:", fileUrl);

      // Extract filename from the URL
      const filename = path.basename(url.parse(fileUrl).pathname);

      // Specify the output file path
      const outputFilePath = path.join(__dirname, "../public/temp", filename);

      // Download the file
      await downloadFile(fileUrl, outputFilePath);

      // Attach downloaded file path to request object
      req.downloadedFilePath = outputFilePath;
      next();
    } catch (error) {
      console.error("Error in downloadFileFromCloudinary middleware:", error);
      res
        .status(500)
        .json({ error: "Failed to download file from Cloudinary" });
    }
  };
};

// Export the middleware function
module.exports = downloadFileFromCloudinary;
