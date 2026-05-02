const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔥 absolute path
const uploadPath = path.join(__dirname, '../uploads');

// 🔥 ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // ✅ FIXED
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;