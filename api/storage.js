const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageSettings = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },

  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = Date.now() + fileExtension;
    callback(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storageSettings,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: set a size limit (5MB in this example)
});

module.exports = upload;
