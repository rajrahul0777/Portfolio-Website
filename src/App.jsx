import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Main Portfolio components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Admin components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { API_BASE_URL } from './config';

// Public view assembly
function PublicPortfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [checkingAuth, setCheckingAuth] = useState(!!token);

  useEffect(() => {
    if (token) {
      // Validate token with backend
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          if (!res.success) {
            handleLogout();
          }
          setCheckingAuth(false);
        })
        .catch(() => {
          // If network error, keep token but stop checking
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <h2 className="gradient-text">Verifying Session...</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<PublicPortfolio />} />

        {/* Admin Router */}
        <Route
          path="/admin"
          element={
            token ? (
              <AdminDashboard token={token} onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />

        {/* Redirect Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
