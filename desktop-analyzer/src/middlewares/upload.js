const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb)=>{
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file and pass an error message
    cb(new Error('Invalid file type. Only PNG, JPEG, and WebP images are allowed!'), false);
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload.single('image');
