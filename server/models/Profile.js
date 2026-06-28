const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Rahul Kumar Sharma',
  },
  roles: {
    type: [String],
    default: [
      'MERN Stack Developer',
      'Full Stack Developer',
      'React.js Enthusiast',
      'BCA Student (DS & AI)',
      'Problem Solver',
    ],
  },
  bio: {
    type: String,
    default: 'A passionate BCA student specializing in Data Science & AI, building full-stack web applications with the MERN stack. I transform ideas into scalable, user-friendly digital experiences.',
  },
  aboutText1: {
    type: String,
    default: 'I\'m a motivated BCA student (Data Science & AI) at Babu Banarasi Das University, passionate about building full-stack web applications using the MERN stack. With a strong foundation in programming, databases, and modern web technologies, I enjoy turning complex problems into elegant, scalable solutions.',
  },
  aboutText2: {
    type: String,
    default: 'I specialize in developing dynamic web applications with MongoDB, Express.js, React.js, and Node.js. Currently seeking opportunities to apply my skills in real-world projects and grow as a full-stack developer.',
  },
  email: {
    type: String,
    default: 'rahul950rs@gmail.com',
  },
  phone: {
    type: String,
    default: '+91 8292449037',
  },
  location: {
    type: String,
    default: 'Lucknow, Uttar Pradesh',
  },
  linkedin: {
    type: String,
    default: 'https://www.linkedin.com/in/rahul-sharma-7496a4294',
  },
  github: {
    type: String,
    default: 'https://github.com/rahul950rs',
  },
  dob: {
    type: String,
    default: '24 April 2001',
  },
  languages: {
    type: String,
    default: 'English & Hindi',
  },
  address: {
    type: String,
    default: 'Gopalganj, Bihar 841505',
  },
  resumePath: {
    type: String,
    default: '/Rahul_Kumar_Sharma_Resume.pdf',
  },
  profileImagePath: {
    type: String,
    default: '',
  },
  statsProjects: {
    type: String,
    default: '2+',
  },
  statsCerts: {
    type: String,
    default: '5+',
  },
  statsEducation: {
    type: String,
    default: 'BCA DS & AI — 2026',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
