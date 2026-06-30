const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Use memory storage — file stays in buffer, then we stream to Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|doc|docx|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase().slice(1));
  const mime =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and document files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper: upload buffer to Cloudinary and return secure URL
function uploadToCloudinary(buffer, fieldname, mimetype) {
  return new Promise((resolve, reject) => {
    let folder = 'portfolio';
    let resource_type = 'image';

    if (fieldname === 'certificate') folder = 'portfolio/certificates';
    else if (fieldname === 'resume') {
      folder = 'portfolio/resumes';
      resource_type = 'raw';
    } else if (fieldname === 'profileImage') folder = 'portfolio/profile';
    else if (fieldname === 'image') folder = 'portfolio/projects';

    if (mimetype === 'application/pdf') resource_type = 'raw';

    const public_id = `${fieldname}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

module.exports = { upload, uploadToCloudinary };
