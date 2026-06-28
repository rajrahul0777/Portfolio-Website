import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, SERVER_URL } from '../../config';
import { HiPencil, HiTrash, HiExternalLink } from 'react-icons/hi';

export default function CertificationsEditor({ token }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const [saving, setSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [order, setOrder] = useState(0);
  const [certFile, setCertFile] = useState(null);

  // Use a key to force-reset the file input after upload
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const statusTimerRef = useRef(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  // Auto-clear status message after 4 seconds
  const showStatus = (msg, type = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg('');
      setStatusType('');
    }, 4000);
  };

  const fetchCerts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/certifications`);
      const data = await res.json();
      if (data.success && data.data) {
        setCerts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setTitle(item.title);
    setIssuer(item.issuer);
    setIcon(item.icon || '🏆');
    setOrder(item.order || 0);
    setCertFile(null);
    setFileInputKey(Date.now()); // Reset file input when entering edit mode
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setIcon('🏆');
    setOrder(0);
    setCertFile(null);
    setFileInputKey(Date.now()); // Force file input to clear
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('issuer', issuer);
    formData.append('icon', icon);
    formData.append('order', Number(order));
    if (certFile) {
      formData.append('certificate', certFile);
    }

    const url = editingId
      ? `${API_BASE_URL}/certifications/${editingId}`
      : `${API_BASE_URL}/certifications`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        showStatus(editingId ? '✅ Certification updated!' : '✅ Certification added!', 'success');
        resetForm();
        await fetchCerts(); // Refresh list immediately
      } else {
        showStatus(`❌ Error: ${data.error || 'Failed to save.'}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('❌ Server error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    setStatusMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        showStatus('🗑️ Certification deleted.', 'success');
        await fetchCerts(); // Refresh list immediately
      } else {
        showStatus('❌ Delete failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('❌ Server error during delete.', 'error');
    }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading certifications...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Manage Certifications &amp; Credentials</h3>

      {/* Status Message */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: statusType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${statusType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: statusType === 'success' ? '#6ee7b7' : '#fca5a5',
          marginBottom: 20,
          fontWeight: 500,
          transition: 'all 0.3s ease',
        }}>
          {statusMsg}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="glass-card contact-form" style={{ marginBottom: 30 }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>
          {isEditing ? '✏️ Edit Certification' : '➕ Add Certification'}
        </h4>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Certification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Python 101 for Data Science"
              required
            />
          </div>
          <div className="form-group">
            <label>Credential Issuer</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. IBM — Cognitive Class"
              required
            />
          </div>
          <div className="form-group">
            <label>Badge Icon Emoji</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🏆"
            />
          </div>
          <div className="form-group">
            <label>Sort Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Upload Certificate File — key forces re-mount/reset after upload */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Upload Certificate Document / Image (PDF, JPG, PNG)</label>
          <div className="file-upload-wrapper">
            <input
              key={fileInputKey}
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setCertFile(e.target.files[0])}
            />
          </div>
          {certFile && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-tertiary)', marginTop: 6 }}>
              📎 Selected: {certFile.name}
            </div>
          )}
        </div>

        <div className="admin-btn-row">
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '⏳ Saving...' : isEditing ? 'Update Certification' : 'Add Certification'}
          </button>
        </div>
      </form>

      {/* Existing Certifications List */}
      <h4 style={{ marginBottom: 12 }}>
        Existing Certifications
        <span style={{ marginLeft: 10, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          ({certs.length} total)
        </span>
      </h4>

      <div className="admin-items-list">
        {certs.length === 0 ? (
          <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>
            No certifications yet. Add one above!
          </div>
        ) : (
          certs.map((item) => (
            <div key={item._id} className="glass-card admin-item-card">
              <div className="admin-item-info">
                <div className="admin-item-title">{item.icon} {item.title}</div>
                <div className="admin-item-subtitle">
                  {item.issuer}
                  <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· Sort: {item.order}</span>
                  {item.filePath && (
                    <span style={{ marginLeft: 12 }}>
                      <a
                        href={`${SERVER_URL}${item.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        View File <HiExternalLink size={12} />
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className="admin-item-actions">
                <button className="admin-icon-btn" onClick={() => handleEditClick(item)} title="Edit">
                  <HiPencil />
                </button>
                <button className="admin-icon-btn delete" onClick={() => handleDelete(item._id)} title="Delete">
                  <HiTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
