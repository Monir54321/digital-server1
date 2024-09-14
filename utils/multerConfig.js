// utils/multerConfig.js
const multer = require("multer");
const path = require("path");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../files")); // Define folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueSuffix + sanitizedFileName); // Generate unique filename
  },
});

// Export a Multer upload instance that can be reused
const uploadPdf = multer({ storage: storage });

module.exports = uploadPdf;
