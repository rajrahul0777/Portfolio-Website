const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:4173',  // Vite preview
  process.env.FRONTEND_URL, // Production Vercel URL (set in Render env vars)
].filter(Boolean); // remove undefined if FRONTEND_URL not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

app.use(express.json());

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Health check endpoint (useful for Render to keep server warm)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

