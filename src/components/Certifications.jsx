import { useEffect, useRef, useState } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { API_BASE_URL, SERVER_URL } from '../config';

export default function Certifications() {
  const sectionRef = useRef(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/certifications`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setCertifications(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching certifications:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return null;

  const getCertUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
  };

  return (
    <section id="certifications" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-center fade-in">
          <span className="section-tag">🏆 Achievements</span>
          <h2 className="section-title">
            Certifications &amp; <span className="gradient-text">Credentials</span>
          </h2>
          <p className="section-subtitle">
            Industry-recognized certifications demonstrating expertise in full-stack, data science, and cloud technologies.
          </p>
        </div>

        <div className="certifications-grid">
          {certifications.map((cert, i) => {
            const certUrl = getCertUrl(cert.filePath);
            const CardContent = (
              <>
                <div className="certification-icon">{cert.icon || '🏆'}</div>
                <h3 className="certification-title">{cert.title}</h3>
                <div className="certification-issuer">
                  <span style={{ fontSize: '0.85rem' }}>🏢</span>
                  {cert.issuer}
                </div>
                {certUrl && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 'auto',
                      fontWeight: 600
                    }}
                  >
                    View Credential <HiExternalLink size={12} />
                  </span>
                )}
              </>
            );

            return certUrl ? (
              <a
                key={cert._id || i}
                href={certUrl}
                target="_blank"
                rel="noreferrer"
                className={`glass-card certification-card fade-in fade-in-delay-${(i % 4) + 1}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {CardContent}
              </a>
            ) : (
              <div
                key={cert._id || i}
                className={`glass-card certification-card fade-in fade-in-delay-${(i % 4) + 1}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
