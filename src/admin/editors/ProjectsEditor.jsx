import { useState, useEffect } from 'react';
import { API_BASE_URL, SERVER_URL } from '../../config';
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function ProjectsEditor({ token }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [desc, setDesc] = useState('');
  const [features, setFeatures] = useState('');
  const [tech, setTech] = useState('');
  const [github, setGithub] = useState('');
  const [live, setLive] = useState('');
  const [badgeClass, setBadgeClass] = useState('project-badge-1');
  const [iconClass, setIconClass] = useState('project-icon-1');
  const [icon, setIcon] = useState('🚀');
  const [imageFile, setImageFile] = useState(null);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProjects(res.data);
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
    setTitle(item.title);
    setBadge(item.badge);
    setDesc(item.desc);
    setFeatures(item.features ? item.features.join('\n') : '');
    setTech(item.tech ? item.tech.join(', ') : '');
    setGithub(item.github || '');
    setLive(item.live || '');
    setBadgeClass(item.badgeClass || 'project-badge-1');
    setIconClass(item.iconClass || 'project-icon-1');
    setIcon(item.icon || '🚀');
    setOrder(item.order || 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setBadge('');
    setDesc('');
    setFeatures('');
    setTech('');
    setGithub('');
    setLive('');
    setBadgeClass('project-badge-1');
    setIconClass('project-icon-1');
    setIcon('🚀');
    setImageFile(null);
    setOrder(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const featuresArray = features.split('\n').map(f => f.trim()).filter(Boolean);
    const techArray = tech.split(',').map(t => t.trim()).filter(Boolean);

    // Use FormData for Multer file upload support
    const formData = new FormData();
    formData.append('title', title);
    formData.append('badge', badge);
    formData.append('desc', desc);
    formData.append('features', JSON.stringify(featuresArray));
    formData.append('tech', JSON.stringify(techArray));
    formData.append('github', github);
    formData.append('live', live);
    formData.append('badgeClass', badgeClass);
    formData.append('iconClass', iconClass);
    formData.append('icon', icon);
    formData.append('order', Number(order));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = editingId ? `${API_BASE_URL}/projects/${editingId}` : `${API_BASE_URL}/projects`;
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg(editingId ? '✅ Project updated successfully!' : '✅ Project added!');
          handleCancel();
          fetchProjects();
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
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setStatusMsg('');

    fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setStatusMsg('🗑️ Project deleted.');
          fetchProjects();
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
      <h3 style={{ marginBottom: 16 }}>Manage Projects</h3>

      {statusMsg && (
        <div style={{ padding: 14, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', marginBottom: 20, fontWeight: 500 }}>
          {statusMsg}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="glass-card contact-form" style={{ marginBottom: 30 }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>
          {isEditing ? 'Edit Project' : 'Add Project'}
        </h4>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Smart Hospital System" required />
          </div>
          <div className="form-group">
            <label>Project Tag/Badge</label>
            <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Healthcare • Full Stack" required />
          </div>
          <div className="form-group">
            <label>Badge Color Class</label>
            <select value={badgeClass} onChange={(e) => setBadgeClass(e.target.value)}>
              <option value="project-badge-1">Style 1 (Cyan/Blue)</option>
              <option value="project-badge-2">Style 2 (Green/Teal)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Icon Emoji</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🏥" />
          </div>
          <div className="form-group">
            <label>GitHub Repository URL</label>
            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label>Live Demo URL (leave blank if private)</label>
            <input type="text" value={live} onChange={(e) => setLive(e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Tech Stack (comma-separated)</label>
            <input type="text" value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, Express, MongoDB" required />
          </div>
          <div className="form-group">
            <label>Sort Order</label>
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Short Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} required />
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Key Features (one feature per line)</label>
          <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} placeholder="Feature 1&#10;Feature 2" required />
        </div>

        {/* Upload Project Image */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Project Cover Image (Upload replaces default icon)</label>
          <div className="file-upload-wrapper">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
        </div>

        <div className="admin-btn-row">
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </form>

      {/* List projects */}
      <h4 style={{ marginBottom: 12 }}>Existing Projects</h4>
      <div className="admin-items-list">
        {projects.map((project) => (
          <div key={project._id} className="glass-card admin-item-card">
            <div className="admin-item-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              {project.imagePath ? (
                <img
                  src={`${SERVER_URL}${project.imagePath}`}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontSize: '1.8rem' }}>{project.icon || '🚀'}</div>
              )}
              <div>
                <div className="admin-item-title">{project.title}</div>
                <div className="admin-item-subtitle">{project.badge} (Sort: {project.order})</div>
              </div>
            </div>
            <div className="admin-item-actions">
              <button className="admin-icon-btn" onClick={() => handleEditClick(project)} title="Edit">
                <HiPencil />
              </button>
              <button className="admin-icon-btn delete" onClick={() => handleDelete(project._id)} title="Delete">
                <HiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
