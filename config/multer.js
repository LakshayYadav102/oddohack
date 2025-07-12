const multer = require('multer');
const path = require('path');

// Destination & file name logic
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Only .jpg, .jpeg, .png files are allowed!");
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
