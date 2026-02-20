// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to create storage for different folders
const createStorage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folderName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); // create folder if missing
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

// Only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Factory function to create upload middleware
const uploadFiles = (folderName) =>
  multer({ storage: createStorage(folderName), fileFilter });

module.exports = uploadFiles;
