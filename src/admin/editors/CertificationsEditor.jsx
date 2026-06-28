import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, SERVER_URL } from '../../config';
import { HiPencil, HiTrash, HiExternalLink, HiCheckCircle } from 'react-icons/hi';

export default function CertificationsEditor({ token }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [order, setOrder] = useState(0);
  const [certFile, setCertFile] = useState(null);
  const [credentialUrl, setCredentialUrl] = useState('');

  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const statusTimerRef = useRef(null);
  const formRef = useRef(null); // ref to scroll to form on edit

  useEffect(() => {
    fetchCerts();
  }, []);

  const showStatus = (msg, type = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg('');
      setStatusType('');
    }, 5000);
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
    setCredentialUrl(item.credentialUrl || '');
    setCertFile(null);
    setFileInputKey(Date.now());
    // Scroll to form smoothly
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setIcon('🏆');
    setOrder(0);
    setCredentialUrl('');
    setCertFile(null);
    setFileInputKey(Date.now());
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
    formData.append('credentialUrl', credentialUrl.trim());
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
        showStatus(editingId ? '✅ Certification updated & publicly visible!' : '✅ Certification added & now publicly visible!', 'success');
        resetForm();
        await fetchCerts();
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
        await fetchCerts();
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
        }}>
          {statusMsg}
        </div>
      )}

      {/* Editor Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="glass-card contact-form" style={{ marginBottom: 30 }}>
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

        {/* External Credential URL */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>🔗 External Credential URL (Credly / IBM / Coursera link)</label>
          <input
            type="url"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://www.credly.com/badges/... or https://courses.cognitiveclass.ai/..."
          />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Paste the external badge/certificate URL here. Visitors will click this to view the credential.
          </div>
        </div>

        {/* Upload Certificate File */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>📎 Upload Certificate Image / PDF (optional — overrides URL if both provided)</label>
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
            {saving ? '⏳ Saving...' : isEditing ? '💾 Update Certification' : '➕ Add Certification'}
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

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <HiCheckCircle style={{ color: '#10b981' }} /> = Publicly visible credential link
        </span>
        <span>No badge = no link set (credential not clickable on site)</span>
      </div>

      <div className="admin-items-list">
        {certs.length === 0 ? (
          <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>
            No certifications yet. Add one above!
          </div>
        ) : (
          certs.map((item) => {
            const hasFile = item.filePath && item.filePath.trim() !== '';
            const hasUrl = item.credentialUrl && item.credentialUrl.trim() !== '';
            const publicLink = hasFile
              ? `${SERVER_URL}${item.filePath}`
              : hasUrl
                ? item.credentialUrl
                : null;

            return (
              <div key={item._id} className="glass-card admin-item-card">
                <div className="admin-item-info">
                  <div className="admin-item-title">{item.icon} {item.title}</div>
                  <div className="admin-item-subtitle">
                    {item.issuer}
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· Sort: {item.order}</span>
                  </div>

                  {/* Credential link status */}
                  <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {hasFile && (
                      <a
                        href={`${SERVER_URL}${item.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '0.75rem', color: '#10b981',
                          background: 'rgba(16,185,129,0.1)', padding: '2px 8px',
                          borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)',
                          fontWeight: 600,
                        }}
                      >
                        <HiCheckCircle /> Uploaded File — Publicly Visible <HiExternalLink size={11} />
                      </a>
                    )}
                    {hasUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '0.75rem', color: 'var(--accent-tertiary)',
                          background: 'rgba(99,102,241,0.1)', padding: '2px 8px',
                          borderRadius: 4, border: '1px solid rgba(99,102,241,0.3)',
                          fontWeight: 600,
                        }}
                      >
                        <HiCheckCircle /> External URL — Publicly Visible <HiExternalLink size={11} />
                      </a>
                    )}
                    {!publicLink && (
                      <span style={{
                        fontSize: '0.75rem', color: '#f59e0b',
                        background: 'rgba(245,158,11,0.1)', padding: '2px 8px',
                        borderRadius: 4, border: '1px solid rgba(245,158,11,0.3)',
                      }}>
                        ⚠️ No credential link — card not clickable on site
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
            );
          })
        )}
      </div>
    </div>
  );
}
