const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: true,
  },
  badgeClass: {
    type: String,
    default: 'project-badge-1',
  },
  iconClass: {
    type: String,
    default: 'project-icon-1',
  },
  icon: {
    type: String,
    default: '🚀',
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  tech: {
    type: [String],
    default: [],
  },
  github: {
    type: String,
    default: 'https://github.com/rahul950rs',
  },
  live: {
    type: String,
    default: '',
  },
  imagePath: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
