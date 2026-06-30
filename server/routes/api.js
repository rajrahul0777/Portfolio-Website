const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const ContactMessage = require('../models/ContactMessage');

// Middleware
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rahul_portfolio_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/* =========================================================================
   AUTH ROUTES
   ========================================================================= */

// @route   POST /api/auth/login
// @desc    Auth admin & get token
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please provide username and password' });
  }

  try {
    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, username: admin.username, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin info
router.get('/auth/me', protect, async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @route   PUT /api/auth/update-password
// @desc    Update admin password
router.put('/auth/update-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Please provide current and new password' });
  }

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, error: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/auth/update-credentials
// @desc    Update admin username and/or password
router.put('/auth/update-credentials', protect, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ success: false, error: 'Current password is required to make any changes' });
  }
  if (!newUsername && !newPassword) {
    return res.status(400).json({ success: false, error: 'Please provide a new username or new password to update' });
  }

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, error: 'Incorrect current password' });
    }

    if (newUsername && newUsername.trim() !== '') {
      // Check if username already taken by another admin
      const existing = await Admin.findOne({ username: newUsername.trim() });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ success: false, error: 'Username already taken' });
      }
      admin.username = newUsername.trim();
    }

    if (newPassword && newPassword.length >= 6) {
      admin.password = newPassword;
    } else if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    await admin.save();
    res.json({
      success: true,
      message: 'Credentials updated successfully',
      admin: { id: admin._id, username: admin.username, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   PROFILE ROUTES
   ========================================================================= */

// @route   GET /api/profile
// @desc    Get profile details
router.get('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/profile
// @desc    Update profile details
router.put('/profile', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/profile/upload
// @desc    Upload profile files (resume or photo)
router.post('/profile/upload', protect, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const updates = {};
    if (req.files.resume && req.files.resume[0]) {
      // Cloudinary returns the full URL in .path
      updates.resumePath = req.files.resume[0].path;
    }
    if (req.files.profileImage && req.files.profileImage[0]) {
      updates.profileImagePath = req.files.profileImage[0].path;
    }

    profile = await Profile.findByIdAndUpdate(profile._id, updates, { new: true });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   SKILLS ROUTES
   ========================================================================= */

router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort('order');
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/skills', protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/skills/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, error: 'Skill category not found' });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/skills/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, error: 'Skill category not found' });
    res.json({ success: true, message: 'Skill category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   PROJECTS ROUTES
   ========================================================================= */

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('order');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/projects', protect, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      // Cloudinary returns full CDN URL in req.file.path
      projectData.imagePath = req.file.path;
    }
    // Parse arrays if sent as strings (from FormData)
    if (typeof projectData.features === 'string') {
      projectData.features = JSON.parse(projectData.features);
    }
    if (typeof projectData.tech === 'string') {
      projectData.tech = JSON.parse(projectData.tech);
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/projects/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      // Cloudinary returns full CDN URL in req.file.path
      projectData.imagePath = req.file.path;
    }
    if (typeof projectData.features === 'string') {
      projectData.features = JSON.parse(projectData.features);
    }
    if (typeof projectData.tech === 'string') {
      projectData.tech = JSON.parse(projectData.tech);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/projects/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   EDUCATION ROUTES
   ========================================================================= */

router.get('/education', async (req, res) => {
  try {
    const education = await Education.find().sort('order');
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/education', protect, async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/education/:id', protect, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!education) return res.status(404).json({ success: false, error: 'Education entry not found' });
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/education/:id', protect, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ success: false, error: 'Education entry not found' });
    res.json({ success: true, message: 'Education entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   CERTIFICATIONS ROUTES
   ========================================================================= */

router.get('/certifications', async (req, res) => {
  try {
    const certs = await Certification.find().sort('order');
    res.json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/certifications', protect, upload.single('certificate'), async (req, res) => {
  try {
    const certData = { ...req.body };
    if (req.file) {
      // Cloudinary returns full CDN URL in req.file.path — stored directly
      certData.filePath = req.file.path;
    }
    if (certData.credentialUrl) {
      certData.credentialUrl = certData.credentialUrl.trim();
    }
    const cert = await Certification.create(certData);
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/certifications/:id', protect, upload.single('certificate'), async (req, res) => {
  try {
    const certData = { ...req.body };
    if (req.file) {
      // Cloudinary returns full CDN URL in req.file.path — stored directly
      certData.filePath = req.file.path;
    }
    if (certData.credentialUrl !== undefined) {
      certData.credentialUrl = certData.credentialUrl.trim();
    }
    const cert = await Certification.findByIdAndUpdate(req.params.id, certData, {
      new: true,
      runValidators: true,
    });
    if (!cert) return res.status(404).json({ success: false, error: 'Certification not found' });
    res.json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/certifications/:id', protect, async (req, res) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ success: false, error: 'Certification not found' });
    res.json({ success: true, message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/* =========================================================================
   CONTACT MESSAGES ROUTES
   ========================================================================= */

// @route   POST /api/contact
// @desc    Submit a contact message (Public)
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Please provide all fields' });
  }

  try {
    const newMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/contact/messages
// @desc    Get all messages (Admin)
router.get('/contact/messages', protect, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/contact/messages/:id
// @desc    Toggle/Mark message as read (Admin)
router.put('/contact/messages/:id', protect, async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    msg.isRead = !msg.isRead;
    await msg.save();
    res.json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/contact/messages/:id
// @desc    Delete a message (Admin)
router.delete('/contact/messages/:id', protect, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
