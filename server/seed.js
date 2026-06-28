const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Education = require('./models/Education');
const Certification = require('./models/Certification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});

    console.log('Database cleared.');

    // 1. Create Default Admin
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user seeded: admin / admin123');

    // 2. Create Profile Info
    await Profile.create({
      name: 'Rahul Kumar Sharma',
      roles: [
        'MERN Stack Developer',
        'Full Stack Developer',
        'React.js Enthusiast',
        'BCA Student (DS & AI)',
        'Problem Solver',
      ],
      bio: 'A passionate BCA student specializing in Data Science & AI, building full-stack web applications with the MERN stack. I transform ideas into scalable, user-friendly digital experiences.',
      aboutText1: 'I\'m a motivated BCA student (Data Science & AI) at Babu Banarasi Das University, passionate about building full-stack web applications using the MERN stack. With a strong foundation in programming, databases, and modern web technologies, I enjoy turning complex problems into elegant, scalable solutions.',
      aboutText2: 'I specialize in developing dynamic web applications with MongoDB, Express.js, React.js, and Node.js. Currently seeking opportunities to apply my skills in real-world projects and grow as a full-stack developer.',
      email: 'rahul950rs@gmail.com',
      phone: '+91 8292449037',
      location: 'Lucknow, Uttar Pradesh',
      linkedin: 'https://www.linkedin.com/in/rahul-sharma-7496a4294',
      github: 'https://github.com/rahul950rs',
      dob: '24 April 2001',
      languages: 'English & Hindi',
      address: 'Gopalganj, Bihar 841505',
      resumePath: '/Rahul_Kumar_Sharma_Resume.pdf',
      statsProjects: '2+',
      statsCerts: '5+',
      statsEducation: 'BCA DS & AI — 2026',
    });
    console.log('Profile info seeded.');

    // 3. Create Skills
    const skillsList = [
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
    await Skill.create(skillsList);
    console.log('Skills seeded.');

    // 4. Create Projects
    const projectsList = [
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
    await Project.create(projectsList);
    console.log('Projects seeded.');

    // 5. Create Education
    const educationList = [
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
    await Education.create(educationList);
    console.log('Education seeded.');

    // 6. Create Certifications
    const certsList = [
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
    await Certification.create(certsList);
    console.log('Certifications seeded.');

    console.log('All data successfully seeded!');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
