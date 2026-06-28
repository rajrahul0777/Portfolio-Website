import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function SkillsEditor({ token }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('mern');
  const [highlight, setHighlight] = useState(false);
  const [skillsList, setSkillsList] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    fetch(`${API_BASE_URL}/skills`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setSkills(res.data);
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
    setCategory(item.category);
    setType(item.type);
    setHighlight(item.highlight || false);
    setSkillsList(item.skills.join(', '));
    setOrder(item.order || 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setCategory('');
    setType('mern');
    setHighlight(false);
    setSkillsList('');
    setOrder(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const parsedSkills = skillsList.split(',').map(s => s.trim()).filter(Boolean);
    const bodyData = {
      category,
      type,
      highlight,
      skills: parsedSkills,
      order: Number(order)
    };

    const url = editingId ? `${API_BASE_URL}/skills/${editingId}` : `${API_BASE_URL}/skills`;
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
          setStatusMsg(editingId ? '✅ Skill updated successfully!' : '✅ Skill category added!');
          handleCancel();
          fetchSkills();
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
    if (!window.confirm('Are you sure you want to delete this skill category?')) return;
    setStatusMsg('');

    fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg('🗑️ Skill category deleted.');
          fetchSkills();
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
      <h3 style={{ marginBottom: 16 }}>Manage Skills</h3>

      {statusMsg && (
        <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', marginBottom: 20, fontWeight: 500 }}>
          {statusMsg}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="glass-card contact-form" style={{ marginBottom: 30 }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>
          {isEditing ? 'Edit Skill Category' : 'Add Skill Category'}
        </h4>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Category Title</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. MERN Stack, Databases" required />
          </div>
          <div className="form-group">
            <label>Design Style Group (Coded CSS Class)</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="mern">MERN Highlight Style (Purple/Blue)</option>
              <option value="programming">Programming Style (Yellow/Red)</option>
              <option value="web">Web Style (Orange/Pink)</option>
              <option value="database">Database Style (Green/Cyan)</option>
              <option value="tools">Tools Style (Purple/Indigo)</option>
              <option value="visualization">Data Visualization Style (Cyan/Blue)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Skills List (comma-separated)</label>
            <input type="text" value={skillsList} onChange={(e) => setSkillsList(e.target.value)} placeholder="HTML, CSS, JS" required />
          </div>
          <div className="form-group">
            <label>Sort Order Number</label>
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <input type="checkbox" id="skill-highlight" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
          <label htmlFor="skill-highlight">Highlight/Feature Category Glow</label>
        </div>

        <div className="admin-btn-row">
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>

      {/* Existing items list */}
      <h4 style={{ marginBottom: 12 }}>Existing Skill Categories</h4>
      <div className="admin-items-list">
        {skills.map((item) => (
          <div key={item._id} className="glass-card admin-item-card">
            <div className="admin-item-info">
              <div className="admin-item-title">{item.category}</div>
              <div className="admin-item-subtitle">{item.skills.join(', ')} (Sort: {item.order})</div>
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
