const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

module.exports = upload;
