const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage — files stored permanently on Cloudinary CDN
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type
    let folder = 'portfolio';
    let resource_type = 'image';

    if (file.fieldname === 'certificate') {
      folder = 'portfolio/certificates';
    } else if (file.fieldname === 'resume') {
      folder = 'portfolio/resumes';
      resource_type = 'raw'; // PDFs are raw
    } else if (file.fieldname === 'profileImage') {
      folder = 'portfolio/profile';
    } else if (file.fieldname === 'image') {
      folder = 'portfolio/projects';
    }

    // If file is a PDF, always use raw
    if (file.mimetype === 'application/pdf') {
      resource_type = 'raw';
    }

    return {
      folder,
      resource_type,
      // Keep original filename (sanitized)
      public_id: `${file.fieldname}-${Date.now()}`,
      // Auto-format and quality (only for images)
      ...(resource_type === 'image' && {
        format: undefined, // keep original format
        transformation: [{ quality: 'auto' }],
      }),
    };
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|doc|docx|webp/;
  const ext = allowed.test(file.originalname.toLowerCase().split('.').pop());
  const mime = file.mimetype.startsWith('image/') ||
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

module.exports = upload;
