import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config';

export default function Education() {
  const sectionRef = useRef(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/education`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setEducation(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching education:', err);
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

  return (
    <section id="education" className="section" ref={sectionRef} style={{ background: 'rgba(13, 17, 23, 0.5)' }}>
      <div className="container">
        <div className="section-header-center fade-in">
          <span className="section-tag">🎓 Education</span>
          <h2 className="section-title">
            Academic <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle">
            Building a strong foundation in Computer Science, Data Science, and Artificial Intelligence.
          </p>
        </div>

        <div className="education-timeline">
          {education.map((edu, i) => (
            <div key={edu._id || i} className={`education-item fade-in fade-in-delay-${i + 1}`}>
              <div className="education-dot">{edu.icon || '🎓'}</div>
              <div className="education-content">
                <div className="education-year">{edu.year}</div>
                <div className="education-degree">{edu.degree}</div>
                <div className="education-institution">{edu.institution}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
