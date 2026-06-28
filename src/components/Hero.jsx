import { useState, useEffect } from 'react';
import { HiArrowDown as IconArrowDown, HiDownload as IconDownload } from 'react-icons/hi';
import { API_BASE_URL, SERVER_URL } from '../config';

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    fetch(`${API_BASE_URL}/profile`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProfile(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  const roles = profile?.roles && profile.roles.length > 0
    ? profile.roles
    : ['MERN Stack Developer', 'Full Stack Developer', 'React.js Enthusiast'];

  // Typewriter effect
  useEffect(() => {
    if (loading || roles.length === 0) return;
    const current = roles[roleIndex];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), 70);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setRoleIndex(r => (r + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex, loading, roles]);

  useEffect(() => {
    if (roles.length > 0) {
      setDisplayText(roles[roleIndex].slice(0, charIndex));
    }
  }, [charIndex, roleIndex, roles]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResumeUrl = () => {
    if (!profile?.resumePath) return '#';
    if (profile.resumePath.startsWith('http')) return profile.resumePath;
    return `${SERVER_URL}${profile.resumePath}`;
  };

  if (loading) {
    return (
      <section id="home" className="hero" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="gradient-text">Loading Portfolio...</h2>
        </div>
      </section>
    );
  }

  // Split name for styling
  const nameParts = profile?.name ? profile.name.split(' ') : ['Rahul', 'Kumar', 'Sharma'];
  const firstName = nameParts.slice(0, nameParts.length - 1).join(' ');
  const lastName = nameParts[nameParts.length - 1];

  return (
    <section id="home" className="hero">
      {/* Background */}
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Available for opportunities
        </div>

        <p className="hero-greeting">👋 Hello, I&apos;m</p>

        <h1 className="hero-name">
          {firstName}
          <span>{lastName}</span>
        </h1>

        <div className="hero-title">
          &gt; {displayText}
          <span className="typewriter-cursor" />
        </div>

        <p className="hero-desc">
          {profile?.bio || 'A passionate BCA student specializing in Data Science & AI, building full-stack web applications with the MERN stack.'}
        </p>

        <div className="hero-actions">
          <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            Hire Me
            <IconArrowDown size={18} />
          </a>
          <a
            href={getResumeUrl()}
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
            download
          >
            <IconDownload size={18} />
            Download CV
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">{profile?.statsProjects || '2+'}</span>
            <span className="hero-stat-label">Projects Built</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">{profile?.statsCerts || '5+'}</span>
            <span className="hero-stat-label">IBM Certifications</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">{profile?.statsEducation || 'BCA'}</span>
            <span className="hero-stat-label">Education Status</span>
          </div>
        </div>
      </div>
    </section>
  );
}
