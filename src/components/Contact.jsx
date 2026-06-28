import { useEffect, useRef, useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

export default function Contact() {
  const sectionRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
        console.error('Error fetching profile in Contact:', err);
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

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setSent(true);
          setTimeout(() => setSent(false), 4000);
          setForm({ name: '', email: '', subject: '', message: '' });
        } else {
          setErrorMsg(res.error || 'Failed to send message.');
        }
        setSubmitting(false);
      })
      .catch(err => {
        console.error('Error sending message:', err);
        setErrorMsg('Network error, please try again.');
        setSubmitting(false);
      });
  };

  if (loading) return null;

  const contactItems = [
    { icon: <HiMail />, label: 'Email', value: profile?.email || 'rahul950rs@gmail.com', href: `mailto:${profile?.email || 'rahul950rs@gmail.com'}` },
    { icon: <HiPhone />, label: 'Phone', value: profile?.phone || '+91 8292449037', href: `tel:${profile?.phone || '+918292449037'}` },
    { icon: <HiLocationMarker />, label: 'Location', value: profile?.location || 'Lucknow, Uttar Pradesh', href: null },
  ];

  const socials = [
    { icon: <FaLinkedin />, href: profile?.linkedin || 'https://www.linkedin.com/in/rahul-sharma-7496a4294', label: 'LinkedIn' },
    { icon: <FaGithub />, href: profile?.github || 'https://github.com/rahul950rs', label: 'GitHub' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
  ];

  return (
    <section id="contact" className="section" ref={sectionRef} style={{ background: 'rgba(13, 17, 23, 0.5)' }}>
      <div className="container">
        <div className="section-header-center fade-in">
          <span className="section-tag">📬 Contact</span>
          <h2 className="section-title">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind or an opportunity to discuss? I&apos;d love to hear from you. Let&apos;s build something amazing!
          </p>
        </div>

        <div className="contact-wrapper">
          {/* Left: Info */}
          <div className="contact-info fade-in fade-in-delay-1">
            {contactItems.map((item, i) => (
              <div key={i} className="glass-card contact-item">
                <div className="contact-item-icon">{item.icon}</div>
                <div>
                  <div className="contact-item-label">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="contact-item-value"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="contact-item-value">{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="glass-card contact-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="contact-item-label" style={{ marginBottom: 12 }}>Follow me on</div>
              <div className="social-links">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form className="glass-card contact-form fade-in fade-in-delay-2" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Project collaboration / Internship inquiry..."
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }}>
                ❌ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              {sent ? '✅ Message Sent!' : submitting ? 'Sending...' : (
                <>
                  Send Message
                  <HiPaperAirplane size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
