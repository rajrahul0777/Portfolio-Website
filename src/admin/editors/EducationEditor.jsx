import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function EducationEditor({ token }) {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [year, setYear] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [icon, setIcon] = useState('🎓');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    fetch(`${API_BASE_URL}/education`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setEducation(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setYear(item.year);
    setDegree(item.degree);
    setInstitution(item.institution);
    setIcon(item.icon || '🎓');
    setOrder(item.order || 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setYear('');
    setDegree('');
    setInstitution('');
    setIcon('🎓');
    setOrder(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const bodyData = {
      year,
      degree,
      institution,
      icon,
      order: Number(order)
    };

    const url = editingId ? `${API_BASE_URL}/education/${editingId}` : `${API_BASE_URL}/education`;
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg(editingId ? '✅ Education entry updated successfully!' : '✅ Education entry added!');
          handleCancel();
          fetchEducation();
        } else {
          setStatusMsg(`❌ Error: ${res.error || 'Failed to save.'}`);
        }
        setSaving(false);
      })
      .catch(err => {
        console.error(err);
        setStatusMsg('❌ Server error occurred.');
        setSaving(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    setStatusMsg('');

    fetch(`${API_BASE_URL}/education/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg('🗑️ Education entry deleted.');
          fetchEducation();
        } else {
          setStatusMsg('❌ Delete failed.');
        }
      })
      .catch(err => {
        console.error(err);
        setStatusMsg('❌ Server error during delete.');
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Manage Education Timeline</h3>

      {statusMsg && (
        <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', marginBottom: 20, fontWeight: 500 }}>
          {statusMsg}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="glass-card contact-form" style={{ marginBottom: 30 }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>
          {isEditing ? 'Edit Education Entry' : 'Add Education Entry'}
        </h4>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Year / Duration</label>
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2023 – 2026" required />
          </div>
          <div className="form-group">
            <label>Degree / Qualification</label>
            <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. Bachelor of Computer Applications" required />
          </div>
          <div className="form-group">
            <label>Institution Name</label>
            <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. Babu Banarasi Das University" required />
          </div>
          <div className="form-group">
            <label>Timeline Icon Emoji</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🎓" />
          </div>
          <div className="form-group">
            <label>Sort Order</label>
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required />
          </div>
        </div>

        <div className="admin-btn-row">
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </form>

      {/* List items */}
      <h4 style={{ marginBottom: 12 }}>Existing Education Entries</h4>
      <div className="admin-items-list">
        {education.map((item) => (
          <div key={item._id} className="glass-card admin-item-card">
            <div className="admin-item-info">
              <div className="admin-item-title">{item.icon} {item.degree}</div>
              <div className="admin-item-subtitle">{item.institution} ({item.year})</div>
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
        ))}
      </div>
    </div>
  );
}
