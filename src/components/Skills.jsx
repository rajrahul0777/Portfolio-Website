import { useEffect, useRef, useState } from 'react';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiJavascript } from 'react-icons/si';
import { FaCode, FaGlobe, FaDatabase, FaTools, FaChartBar } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const iconMap = {
  mern: <SiReact />,
  programming: <FaCode />,
  web: <FaGlobe />,
  database: <FaDatabase />,
  tools: <FaTools />,
  visualization: <FaChartBar />
};

const softSkills = ['Problem-Solving', 'Communication', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking'];

export default function Skills() {
  const sectionRef = useRef(null);
  const [skillGroups, setSkillGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/skills`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setSkillGroups(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skills:', err);
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
    <section id="skills" className="section" ref={sectionRef} style={{ background: 'rgba(13, 17, 23, 0.5)' }}>
      <div className="container">
        <div className="section-header-center fade-in">
          <span className="section-tag">🛠️ Tech Arsenal</span>
          <h2 className="section-title">
            Skills &amp; <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive toolkit for building modern, scalable web applications from database to deployment.
          </p>
        </div>

        {/* MERN Stack Showcase */}
        <div className="mern-showcase-container fade-in fade-in-delay-1">
          <div className="mern-showcase-label">Core Tech Stack</div>
          <div className="mern-showcase">
            {[
              { icon: <SiMongodb color="#47A248" />, label: 'MongoDB' },
              { icon: <SiExpress color="#888" />, label: 'Express.js' },
              { icon: <SiReact color="#61DAFB" />, label: 'React.js' },
              { icon: <SiNodedotjs color="#339933" />, label: 'Node.js' },
              { icon: <SiJavascript color="#F7DF1E" />, label: 'JavaScript' },
            ].map((item, i) => (
              <div key={i} className="mern-badge">
                <span className="mern-badge-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <div
              key={i}
              className={`glass-card skill-category ${group.type} fade-in fade-in-delay-${(i % 4) + 1}`}
            >
              <div className="skill-category-header">
                <div className={`skill-category-icon ${group.highlight ? 'mern-highlight' : ''}`}>
                  {iconMap[group.type] || <FaCode />}
                </div>
                <h3 className="skill-category-title">{group.category}</h3>
              </div>
              <div className="skill-tags">
                {group.skills.map((skill, j) => (
                  <span key={j} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills */}
        <div className="fade-in fade-in-delay-4" style={{ textAlign: 'center', marginTop: 56 }}>
          <span className="section-tag">🧠 Soft Skills</span>
          <div className="soft-skills-row">
            {softSkills.map((s, i) => (
              <span key={i} className="soft-skill-pill">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
