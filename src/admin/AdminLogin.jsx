import { useState } from 'react';
import { API_BASE_URL } from '../config';
import './AdminPanel.css';

export default function AdminLogin({ onLogin }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    // Read values directly from the form elements (uncontrolled inputs)
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.token) {
          localStorage.setItem('admin_token', res.token);
          onLogin(res.token);
        } else {
          setErrorMsg(res.error || 'Invalid credentials');
        }
        setSubmitting(false);
      })
      .catch(err => {
        console.error('Login error:', err);
        setErrorMsg('Network error. Please make sure backend is running.');
        setSubmitting(false);
      });
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <h2 style={{ textAlign: 'center', marginBottom: 8, fontFamily: 'var(--font-heading)' }} className="gradient-text">
          Admin Portal
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 24 }}>
          Enter credentials to manage your portfolio
        </p>

        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: 0, background: 'transparent', border: 'none' }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, marginBottom: 16 }}>
              ❌ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
