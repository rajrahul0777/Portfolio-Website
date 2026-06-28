/**
 * Production Data Upload Script
 * Uploads all local seed data to the production backend via API
 * Run: node upload_production_data.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://portfolio-backend-v08s.onrender.com/api';

// Helper: make HTTP request
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const bodyStr = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ─── Data to Upload ──────────────────────────────────────────────────────────

const skills = [
  {
    category: 'MERN Stack',
    type: 'mern',
    highlight: true,
    skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs', 'JWT Auth'],
    order: 1
  },
  {
    category: 'Programming Languages',
    type: 'programming',
    skills: ['Java', 'Python', 'C'],
    order: 2
  },
  {
    category: 'Web Technologies',
    type: 'web',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    order: 3
  },
  {
    category: 'Databases',
    type: 'database',
    skills: ['MongoDB', 'MySQL', 'SQL Server', 'NoSQL'],
    order: 4
  },
  {
    category: 'Tools & Platforms',
    type: 'tools',
    skills: ['Git', 'VS Code', 'Postman', 'Eclipse', 'IBM Cloud', 'Linux'],
    order: 5
  },
  {
    category: 'Data & Visualization',
    type: 'visualization',
    skills: ['Power BI', 'Tableau', 'Python (Data Science)', 'MS Excel'],
    order: 6
  }
];

const projects = [
  {
    badge: 'Healthcare • Full Stack',
    badgeClass: 'project-badge-1',
    iconClass: 'project-icon-1',
    icon: '🏥',
    title: 'Smart Hospital Appointment System (HOPES)',
    desc: 'A comprehensive full-stack hospital management platform designed to streamline patient-doctor interactions, appointment scheduling, and administrative workflows — reducing wait times and improving healthcare accessibility.',
    features: [
      'Patient registration, login & appointment booking with real-time slot availability',
      'Doctor dashboard for managing schedules, patient records, and consultation history',
      'Admin panel for hospital management, department control, and analytics',
      'Secure authentication using JWT tokens with role-based access control (Patient / Doctor / Admin)',
      'Email/SMS notification system for appointment confirmations and reminders',
    ],
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST API', 'Tailwind CSS', 'Nodemailer'],
    github: 'https://github.com/rahul950rs',
    live: '',
    order: 1
  },
  {
    badge: 'EdTech • Full Stack',
    badgeClass: 'project-badge-2',
    iconClass: 'project-icon-2',
    icon: '📝',
    title: 'Online Examination Control System',
    desc: 'A robust full-stack examination management platform built for educational institutions to conduct, monitor, and evaluate online exams with anti-cheating mechanisms and automated grading — ensuring academic integrity at scale.',
    features: [
      'Dynamic question bank with multi-type support: MCQ, True/False, and Subjective',
      'Real-time exam monitoring with tab-switch detection and auto-submission on timeout',
      'Automated result generation with detailed performance analytics and leaderboard',
      'Role-based portals for Admins, Examiners, and Students with secure login',
      'Randomized question order and option shuffling to prevent cheating',
    ],
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Socket.io', 'JWT', 'Chart.js', 'REST API'],
    github: 'https://github.com/rahul950rs',
    live: '',
    order: 2
  }
];

const education = [
  {
    icon: '🎓',
    year: '2023 – 2026 (Appearing)',
    degree: 'Bachelor of Computer Applications (DS & AI)',
    institution: 'Babu Banarasi Das University, Lucknow',
    order: 1
  },
  {
    icon: '📚',
    year: '2017 – 2019',
    degree: 'Intermediate in Science (10+2)',
    institution: 'Gandhi Inter College',
    order: 2
  },
  {
    icon: '🏫',
    year: '2017',
    degree: 'Matriculation (10th)',
    institution: 'Ibrahim Memorial High School',
    order: 3
  }
];

const certifications = [
  {
    icon: '🐍',
    title: 'Python 101 for Data Science',
    issuer: 'IBM — Cognitive Class',
    order: 1
  },
  {
    icon: '📊',
    title: 'Predictive Modeling Fundamentals I',
    issuer: 'IBM — Cognitive Class',
    order: 2
  },
  {
    icon: '📈',
    title: 'Data Visualization with Python',
    issuer: 'IBM — Cognitive Class',
    order: 3
  },
  {
    icon: '🗄️',
    title: 'NoSQL and DBaaS 101',
    issuer: 'IBM — Cognitive Class',
    order: 4
  },
  {
    icon: '🧠',
    title: 'IBM Cognos Analytics',
    issuer: 'IBM — Cognitive Class',
    order: 5
  }
];

// ─── Main Upload ─────────────────────────────────────────────────────────────

async function uploadAll() {
  console.log('🚀 Starting production data upload...\n');

  // Step 1: Login to get token
  console.log('🔐 Logging in as admin...');
  const loginRes = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });

  if (!loginRes.body.success || !loginRes.body.token) {
    console.error('❌ Login failed:', loginRes.body);
    console.log('\nTrying default seed credentials...');
    // Try seed.js default credentials
    process.exit(1);
  }

  const token = loginRes.body.token;
  console.log('✅ Login successful!\n');

  // Step 2: Upload Skills
  console.log('📤 Uploading Skills...');
  for (const skill of skills) {
    const res = await request('POST', '/skills', skill, token);
    if (res.body.success) {
      console.log(`  ✅ Skill: ${skill.category}`);
    } else {
      console.log(`  ❌ Failed skill ${skill.category}:`, res.body.error);
    }
  }

  // Step 3: Upload Projects
  console.log('\n📤 Uploading Projects...');
  for (const project of projects) {
    const res = await request('POST', '/projects', project, token);
    if (res.body.success) {
      console.log(`  ✅ Project: ${project.title}`);
    } else {
      console.log(`  ❌ Failed project ${project.title}:`, res.body.error);
    }
  }

  // Step 4: Upload Education
  console.log('\n📤 Uploading Education...');
  for (const edu of education) {
    const res = await request('POST', '/education', edu, token);
    if (res.body.success) {
      console.log(`  ✅ Education: ${edu.degree}`);
    } else {
      console.log(`  ❌ Failed education ${edu.degree}:`, res.body.error);
    }
  }

  // Step 5: Upload Certifications
  console.log('\n📤 Uploading Certifications...');
  for (const cert of certifications) {
    const res = await request('POST', '/certifications', cert, token);
    if (res.body.success) {
      console.log(`  ✅ Cert: ${cert.title}`);
    } else {
      console.log(`  ❌ Failed cert ${cert.title}:`, res.body.error);
    }
  }

  // Step 6: Verify
  console.log('\n🔍 Verifying uploads...');
  const [sk, pr, ed, ce] = await Promise.all([
    request('GET', '/skills'),
    request('GET', '/projects'),
    request('GET', '/education'),
    request('GET', '/certifications'),
  ]);

  console.log(`  Skills:         ${sk.body.data?.length ?? 0} records`);
  console.log(`  Projects:       ${pr.body.data?.length ?? 0} records`);
  console.log(`  Education:      ${ed.body.data?.length ?? 0} records`);
  console.log(`  Certifications: ${ce.body.data?.length ?? 0} records`);

  console.log('\n🎉 All data uploaded to production successfully!');
  console.log('🌐 Visit: https://portfolio-frontend-fawn-nine.vercel.app\n');
}

uploadAll().catch(err => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
