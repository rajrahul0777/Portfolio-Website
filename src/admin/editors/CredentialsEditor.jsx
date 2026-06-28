import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { HiShieldCheck, HiEye, HiEyeOff, HiKey, HiUser, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function CredentialsEditor({ token }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword) {
      showToast('error', 'Current password is required.');
      return;
    }

    if (!form.newUsername.trim() && !form.newPassword) {
      showToast('error', 'Enter a new username and/or new password to update.');
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      showToast('error', 'New password and confirm password do not match.');
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    try {
      const body = { currentPassword: form.currentPassword };
      if (form.newUsername.trim()) body.newUsername = form.newUsername.trim();
      if (form.newPassword) body.newPassword = form.newPassword;

      const res = await fetch(`${API_BASE_URL}/auth/update-credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        showToast('success', data.message || 'Credentials updated successfully!');
        setForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast('error', data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      showToast('error', 'Network error. Please make sure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const passwordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { level: 'weak', color: '#ef4444', label: 'Too short' };
    if (pw.length < 8) return { level: 'fair', color: '#f59e0b', label: 'Fair' };
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score === 3 && pw.length >= 10) return { level: 'strong', color: '#22c55e', label: 'Strong' };
    if (score >= 2) return { level: 'good', color: '#6366f1', label: 'Good' };
    return { level: 'fair', color: '#f59e0b', label: 'Fair' };
  };

  const pwStrength = passwordStrength(form.newPassword);

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 20px',
          borderRadius: 12,
          background: toast.type === 'success'
            ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.1))',
          border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: toast.type === 'success' ? '#4ade80' : '#f87171',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
          animation: 'slideIn 0.3s ease',
          maxWidth: 380,
        }}>
          {toast.type === 'success' ? <HiCheckCircle size={20} /> : <HiXCircle size={20} />}
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cred-input-wrap {
          position: relative;
        }
        .cred-input-wrap input {
          padding-right: 44px;
        }
        .cred-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }
        .cred-eye-btn:hover { color: var(--text-primary); }
        .strength-bar-wrap { margin-top: 6px; display: flex; align-items: center; gap: 10px; }
        .strength-bar-track {
          flex: 1;
          height: 4px;
          border-radius: 99px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        .match-indicator {
          font-size: 0.78rem;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .section-divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 28px 0;
        }
      `}</style>

      {/* Page header info card */}
      <div className="glass-card admin-card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HiShieldCheck size={28} color="var(--accent-primary)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Change Admin Credentials
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Update your admin username and/or password. Your current password is always required to confirm changes.
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card admin-card" style={{ maxWidth: 580 }}>
        <form onSubmit={handleSubmit}>

          {/* Current Password (always required) */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              🔐 Verify Identity
            </h3>
            <div className="form-group">
              <label htmlFor="cred-currentPassword">Current Password <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="cred-input-wrap">
                <input
                  id="cred-currentPassword"
                  name="currentPassword"
                  type={showCurrentPw ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="cred-eye-btn" onClick={() => setShowCurrentPw(p => !p)} tabIndex={-1}>
                  {showCurrentPw ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* New Username */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              <HiUser style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Change Username
            </h3>
            <div className="form-group">
              <label htmlFor="cred-newUsername">New Username <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(leave blank to keep current)</span></label>
              <input
                id="cred-newUsername"
                name="newUsername"
                type="text"
                placeholder="Enter new username"
                value={form.newUsername}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          <hr className="section-divider" />

          {/* New Password */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              <HiKey style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Change Password
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label htmlFor="cred-newPassword">New Password <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(leave blank to keep current)</span></label>
              <div className="cred-input-wrap">
                <input
                  id="cred-newPassword"
                  name="newPassword"
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="Enter new password (min 6 chars)"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="cred-eye-btn" onClick={() => setShowNewPw(p => !p)} tabIndex={-1}>
                  {showNewPw ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
              {/* Strength bar */}
              {pwStrength && (
                <div className="strength-bar-wrap">
                  <div className="strength-bar-track">
                    <div className="strength-bar-fill" style={{
                      width: pwStrength.level === 'weak' ? '20%' : pwStrength.level === 'fair' ? '45%' : pwStrength.level === 'good' ? '70%' : '100%',
                      background: pwStrength.color,
                    }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: pwStrength.color, fontWeight: 600, minWidth: 48 }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cred-confirmPassword">Confirm New Password</label>
              <div className="cred-input-wrap">
                <input
                  id="cred-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="cred-eye-btn" onClick={() => setShowConfirmPw(p => !p)} tabIndex={-1}>
                  {showConfirmPw ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
              {/* Match indicator */}
              {form.newPassword && form.confirmPassword && (
                <div className="match-indicator" style={{
                  color: form.newPassword === form.confirmPassword ? '#4ade80' : '#f87171'
                }}>
                  {form.newPassword === form.confirmPassword
                    ? <><HiCheckCircle size={14} /> Passwords match</>
                    : <><HiXCircle size={14} /> Passwords do not match</>
                  }
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="admin-btn-row" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ minWidth: 180, justifyContent: 'center' }}
            >
              {saving ? '⏳ Updating...' : '🔒 Update Credentials'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' })}
              disabled={saving}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
