const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: '🏆',
  },
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    default: '', // stores the path of the uploaded file
  },
  credentialUrl: {
    type: String,
    default: '', // stores external credential URL (Credly, IBM, Coursera, etc.)
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Certification', CertificationSchema);
