const multer = require("multer");

// store file in memory (not disk, not cloudinary here)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;