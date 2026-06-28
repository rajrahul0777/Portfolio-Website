import { useEffect, useRef, useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { API_BASE_URL, SERVER_URL } from '../config';

export default function Projects() {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProjects(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
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

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
  };

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-center fade-in">
          <span className="section-tag">🚀 My Work</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Real-world MERN stack applications built with modern best practices, scalable architecture, and clean code.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <div key={project._id || i} className={`glass-card project-card fade-in fade-in-delay-${i + 1}`}>
              {/* Header */}
              <div className="project-card-header">
                {getImageUrl(project.imagePath) ? (
                  <div className="project-icon" style={{ overflow: 'hidden', padding: 0 }}>
                    <img
                      src={getImageUrl(project.imagePath)}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className={`project-icon ${project.iconClass || 'project-icon-1'}`}>
                    {project.icon || '🚀'}
                  </div>
                )}
                <div className="project-meta">
                  <span className={`project-badge ${project.badgeClass || 'project-badge-1'}`}>
                    {project.badge}
                  </span>
                  <h3 className="project-title">{project.title}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="project-body">
                <p className="project-desc">{project.desc}</p>

                {project.features && project.features.length > 0 && (
                  <div className="project-features">
                    {project.features.map((f, j) => (
                      <div key={j} className="project-feature">
                        <span className="project-feature-dot" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack */}
                {project.tech && project.tech.length > 0 && (
                  <div className="project-tech-stack">
                    {project.tech.map((t, j) => (
                      <span key={j} className="project-tech">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="project-divider" />

              {/* Links */}
              <div className="project-links">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    <FaGithub size={15} />
                    Source Code
                  </a>
                )}
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link primary"
                  >
                    <FaExternalLinkAlt size={13} />
                    Live Demo
                  </a>
                ) : (
                  <span className="project-link" style={{ cursor: 'default', opacity: 0.5 }}>
                    🔒 Private Repo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
