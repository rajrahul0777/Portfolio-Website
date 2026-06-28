import { useEffect, useState } from 'react';
import { FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProfile(res.data);
        }
      })
      .catch(err => console.error('Error fetching profile in Footer:', err));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">&lt;RKS /&gt;</div>

        <div style={{ display: 'flex', gap: 16 }}>
          <a
            href={profile?.linkedin || 'https://www.linkedin.com/in/rahul-sharma-7496a4294'}
            target="_blank"
            rel="noreferrer"
            className="social-link"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href={profile?.github || 'https://github.com/rahul950rs'}
            target="_blank"
            rel="noreferrer"
            className="social-link"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>

        <p className="footer-text">
          © {currentYear} {profile?.name || 'Rahul Kumar Sharma'}. Made with <FaHeart className="footer-heart" style={{ display: 'inline', color: '#ef4444' }} /> using the MERN Stack.
        </p>
      </div>
    </footer>
  );
}
