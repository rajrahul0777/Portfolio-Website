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
    default: '', // stores the link/path of the uploaded file/image
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Certification', CertificationSchema);
