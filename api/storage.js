const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the directory where uploaded files will be stored
const uploadDir = 'public/uploads'; 

// Check if the upload directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory, including any missing parent directories
}

// Define file filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // Allowed image formats
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
  const mimetype = allowedTypes.test(file.mimetype); // Check MIME type

  if (extname && mimetype) {
    return cb(null, true); // If valid file type, proceed with upload
  } else {
    return cb(new Error('Only image files are allowed'), false); // Reject file if not valid
  }
};

// Set up custom storage settings for multer
const storageSettings = multer.diskStorage({
  // Define where to store the uploaded files
  destination: (req, file, callback) => {
    callback(null, uploadDir); // Store files in the 'public/uploads' directory
  },

  // Define the filename for the uploaded files
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname); // Get the file extension from the original file
    const uniqueFilename = Date.now() + fileExtension; // Generate a unique filename using the current timestamp
    callback(null, uniqueFilename); // Use the generated unique filename for the uploaded file
  }
});

// Set up multer to handle file uploads with the custom storage settings
const upload = multer({
  storage: storageSettings,  // Use the custom storage settings defined above
  fileFilter: fileFilter,    // Use the custom file filter function defined above
  limits: { fileSize: 5 * 1024 * 1024 } // Limit the file size to 5MB (5 * 1024 * 1024 bytes)
});

module.exports = upload; // Export the configured multer instance
