const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahul_portfolio_secret_key_2026');
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({ success: false, error: 'Admin user not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};
