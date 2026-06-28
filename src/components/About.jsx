import { useEffect, useRef, useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiExternalLink } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';
import { API_BASE_URL, SERVER_URL } from '../config';

export default function About() {
  const sectionRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching profile in About:', err);
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

  const contacts = [
    { icon: <HiMail />, label: 'Email', value: profile?.email || 'rahul950rs@gmail.com', href: `mailto:${profile?.email || 'rahul950rs@gmail.com'}` },
    { icon: <HiPhone />, label: 'Phone', value: profile?.phone || '+91 8292449037', href: `tel:${profile?.phone || '+918292449037'}` },
    { icon: <HiLocationMarker />, label: 'Location', value: profile?.location || 'Lucknow, Uttar Pradesh', href: null },
    { icon: <FaLinkedin />, label: 'LinkedIn', value: 'Connect with me', href: profile?.linkedin || 'https://www.linkedin.com/in/rahul-sharma-7496a4294' },
  ];

  const getProfileImage = () => {
    if (!profile?.profileImagePath) return null;
    if (profile.profileImagePath.startsWith('http')) return profile.profileImagePath;
    return `${SERVER_URL}${profile.profileImagePath}`;
  };

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left: Avatar */}
          <div className="about-image-wrapper fade-in">
            <div className="about-avatar">
              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt={profile?.name || 'Rahul Kumar Sharma'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>👨‍💻</span>
              )}
              <div className="about-avatar-ring" />
            </div>
            <div className="about-floating-badge about-floating-badge-1">
              🚀 MERN Developer
            </div>
            <div className="about-floating-badge about-floating-badge-2">
              ✅ Open to Work
            </div>
          </div>

          {/* Right: Info */}
          <div className="about-info">
            <div className="fade-in fade-in-delay-1">
              <span className="section-tag">⚡ About Me</span>
              <h2 className="section-title">
                Building Digital<br />
                <span className="gradient-text">Experiences</span>
              </h2>
            </div>

            <p className="about-text fade-in fade-in-delay-2">
              {profile?.aboutText1 || `I'm a motivated BCA student (Data Science & AI) at Babu Banarasi Das University, passionate about building full-stack web applications using the MERN stack. With a strong foundation in programming, databases, and modern web technologies, I enjoy turning complex problems into elegant, scalable solutions.`}
            </p>

            <p className="about-text fade-in fade-in-delay-3">
              {profile?.aboutText2 || `I specialize in developing dynamic web applications with MongoDB, Express.js, React.js, and Node.js. Currently seeking opportunities to apply my skills in real-world projects and grow as a full-stack developer.`}
            </p>

            <div className="about-contact-grid fade-in fade-in-delay-4">
              {contacts.map((c, i) => (
                <div key={i} className="about-contact-item">
                  <div className="about-contact-icon">{c.icon}</div>
                  <div>
                    <div className="about-contact-label">{c.label}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="about-contact-value"
                        target={c.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {c.value}
                        {c.href.startsWith('http') && <HiExternalLink size={12} />}
                      </a>
                    ) : (
                      <div className="about-contact-value">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Details Chips */}
            <div className="personal-details fade-in fade-in-delay-5">
              <span className="personal-detail-chip">🎂 DOB: {profile?.dob || '24 April 2001'}</span>
              <span className="personal-detail-chip">🌐 Languages: {profile?.languages || 'English & Hindi'}</span>
              <span className="personal-detail-chip">📍 Address: {profile?.address || 'Gopalganj, Bihar 841505'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
