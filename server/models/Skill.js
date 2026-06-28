const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  skills: {
    type: [String],
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Skill', SkillSchema);
