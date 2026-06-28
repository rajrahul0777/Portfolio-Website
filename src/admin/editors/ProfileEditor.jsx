import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, SERVER_URL } from '../../config';

export default function ProfileEditor({ token }) {
  const [profile, setProfile] = useState({
    name: '',
    roles: '',
    bio: '',
    aboutText1: '',
    aboutText2: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    dob: '',
    languages: '',
    address: '',
    statsProjects: '',
    statsCerts: '',
    statsEducation: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');

  // Keys to force-reset file inputs after upload
  const [resumeInputKey, setResumeInputKey] = useState(Date.now());
  const [avatarInputKey, setAvatarInputKey] = useState(Date.now());
  const statusTimerRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Auto-clear status after 4 seconds
  const showStatus = (msg, type = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg('');
      setStatusType('');
    }, 4000);
  };

  const fetchProfile = () => {
    fetch(`${API_BASE_URL}/profile`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          const d = res.data;
          setProfile({
            name: d.name || '',
            roles: d.roles ? d.roles.join(', ') : '',
            bio: d.bio || '',
            aboutText1: d.aboutText1 || '',
            aboutText2: d.aboutText2 || '',
            email: d.email || '',
            phone: d.phone || '',
            location: d.location || '',
            linkedin: d.linkedin || '',
            github: d.github || '',
            dob: d.dob || '',
            languages: d.languages || '',
            address: d.address || '',
            statsProjects: d.statsProjects || '',
            statsCerts: d.statsCerts || '',
            statsEducation: d.statsEducation || '',
            resumePath: d.resumePath || '',
            profileImagePath: d.profileImagePath || '',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSaveText = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    // Convert comma separated string to array
    const updatedProfile = {
      ...profile,
      roles: profile.roles.split(',').map(r => r.trim()).filter(Boolean)
    };

    fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedProfile)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          showStatus('✅ Profile text updated successfully!', 'success');
        } else {
          showStatus('❌ Failed to save profile.', 'error');
        }
        setSaving(false);
      })
      .catch(err => {
        console.error(err);
        showStatus('❌ Server error occurred.', 'error');
        setSaving(false);
      });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile && !avatarFile) return;

    setSaving(true);
    setStatusMsg('');

    const formData = new FormData();
    if (resumeFile) formData.append('resume', resumeFile);
    if (avatarFile) formData.append('profileImage', avatarFile);

    try {
      const res = await fetch(`${API_BASE_URL}/profile/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        showStatus('✅ Files uploaded successfully!', 'success');
        // Clear file state and force-reset both file inputs
        setResumeFile(null);
        setAvatarFile(null);
        setResumeInputKey(Date.now());
        setAvatarInputKey(Date.now());
        await fetchProfile(); // Reload profile to show new paths
      } else {
        showStatus('❌ Upload failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('❌ Server error during file upload.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Edit Hero &amp; About Info</h3>

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

      <form onSubmit={handleSaveText} className="glass-card contact-form" style={{ marginBottom: 30 }}>
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>Personal Texts</h4>

        <div className="admin-form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Roles (comma-separated list)</label>
            <input type="text" name="roles" value={profile.roles} onChange={handleChange} placeholder="MERN stack, Developer..." required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Hero Description Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} rows={2} required />
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>About Paragraph 1</label>
          <textarea name="aboutText1" value={profile.aboutText1} onChange={handleChange} rows={3} required />
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>About Paragraph 2</label>
          <textarea name="aboutText2" value={profile.aboutText2} onChange={handleChange} rows={3} required />
        </div>

        <h4 style={{ color: 'var(--accent-primary)', marginTop: 24, marginBottom: 16 }}>Contact &amp; Personal Info</h4>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location (City, State)</label>
            <input type="text" name="location" value={profile.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input type="text" name="github" value={profile.github} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="text" name="dob" value={profile.dob} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Languages</label>
            <input type="text" name="languages" value={profile.languages} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={profile.address} onChange={handleChange} />
          </div>
        </div>

        <h4 style={{ color: 'var(--accent-primary)', marginTop: 24, marginBottom: 16 }}>Dashboard Stats</h4>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Projects stat number</label>
            <input type="text" name="statsProjects" value={profile.statsProjects} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Certs stat number</label>
            <input type="text" name="statsCerts" value={profile.statsCerts} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Education short stat</label>
            <input type="text" name="statsEducation" value={profile.statsEducation} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-btn-row">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving Info...' : 'Save Profile Text'}
          </button>
        </div>
      </form>

      {/* File Upload card */}
      <form onSubmit={handleFileUpload} className="glass-card contact-form">
        <h4 style={{ color: 'var(--accent-primary)', marginBottom: 16 }}>Upload Assets</h4>

        <div className="admin-form-grid" style={{ alignItems: 'center' }}>
          <div className="form-group">
            <label>Upload Resume (PDF only)</label>
            <input
              key={resumeInputKey}
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            {resumeFile && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-tertiary)', marginTop: 6 }}>
                📎 Selected: {resumeFile.name}
              </div>
            )}
            {profile.resumePath && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Current: <a href={`${SERVER_URL}${profile.resumePath}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-tertiary)' }}>{profile.resumePath}</a>
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Upload Profile Photo</label>
            <div className="file-upload-wrapper">
              {profile.profileImagePath ? (
                <img src={`${SERVER_URL}${profile.profileImagePath}`} alt="Avatar" className="file-upload-preview" />
              ) : (
                <div className="file-upload-preview">👨‍💻</div>
              )}
              <input
                key={avatarInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </div>
            {avatarFile && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-tertiary)', marginTop: 6 }}>
                📎 Selected: {avatarFile.name}
              </div>
            )}
          </div>
        </div>

        <div className="admin-btn-row">
          <button type="submit" className="btn-primary" disabled={saving || (!resumeFile && !avatarFile)}>
            {saving ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </form>
    </div>
  );
}
