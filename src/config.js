// Frontend Config
// In development: uses localhost (from .env.local or default)
// In production: uses the deployed Render backend URL (from .env.production)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_BASE_URL = `${BACKEND_URL}/api`;
export const SERVER_URL = BACKEND_URL;
