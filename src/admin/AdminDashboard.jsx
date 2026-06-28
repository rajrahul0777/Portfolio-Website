import { useState } from 'react';
import ProfileEditor from './editors/ProfileEditor';
import SkillsEditor from './editors/SkillsEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import EducationEditor from './editors/EducationEditor';
import CertificationsEditor from './editors/CertificationsEditor';
import MessagesInbox from './editors/MessagesInbox';
import CredentialsEditor from './editors/CredentialsEditor';
import './AdminPanel.css';

import {
  HiUser,
  HiLightningBolt,
  HiBriefcase,
  HiAcademicCap,
  HiBadgeCheck,
  HiInbox,
  HiLogout,
  HiExternalLink,
  HiShieldCheck
} from 'react-icons/hi';

export default function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile & About', icon: <HiUser /> },
    { id: 'skills', label: 'Skills', icon: <HiLightningBolt /> },
    { id: 'projects', label: 'Projects', icon: <HiBriefcase /> },
    { id: 'education', label: 'Education', icon: <HiAcademicCap /> },
    { id: 'certifications', label: 'Certifications', icon: <HiBadgeCheck /> },
    { id: 'messages', label: 'Inbox Messages', icon: <HiInbox /> },
    { id: 'credentials', label: 'Change Credentials', icon: <HiShieldCheck /> },
  ];

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileEditor token={token} />;
      case 'skills':
        return <SkillsEditor token={token} />;
      case 'projects':
        return <ProjectsEditor token={token} />;
      case 'education':
        return <EducationEditor token={token} />;
      case 'certifications':
        return <CertificationsEditor token={token} />;
      case 'messages':
        return <MessagesInbox token={token} />;
      case 'credentials':
        return <CredentialsEditor token={token} />;
      default:
        return <ProfileEditor token={token} />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">&lt;RKS Admin /&gt;</div>

        <nav className="admin-menu-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-menu-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-menu-btn"
            style={{ marginTop: 12, borderTop: '1px solid var(--border-color)', borderRadius: 0, paddingTop: 16 }}
          >
            <HiExternalLink />
            View Live Site
          </a>

          <button className="admin-menu-btn admin-logout-btn" onClick={onLogout}>
            <HiLogout />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h2 className="admin-title">
            {tabs.find((t) => t.id === activeTab)?.label} Manager
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Logged in as Admin
          </div>
        </header>

        <div className="admin-content-body">{renderActiveEditor()}</div>
      </main>
    </div>
  );
}
