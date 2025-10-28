import React from 'react'
import './landing.css'
import Header from '../components/Header'

const Home = ({ navigate, isDarkMode }) => {
  return (
    <div className={isDarkMode ? 'night-mode la-theme' : 'day-mode la-theme'} style={{minHeight: '100vh', display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden', paddingTop: 'var(--app-header-height)'}}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={() => { const b = document.body; if (b.classList.contains('night-mode')) { b.classList.remove('night-mode'); b.classList.add('day-mode') } else { b.classList.remove('day-mode'); b.classList.add('night-mode') } }} />
      <div className="bg-animation"></div>
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 w-full" style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
        <div className="mb-20 text-center" style={{padding: '2rem 3rem 0'}}>
          <h1 className="text-7xl font-black text-white mb-8 bg-gradient-to-r from-green-400 via-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            LearnerAI
          </h1>
          <p className="text-2xl max-w-3xl mx-auto leading-relaxed font-medium" style={{color: isDarkMode ? '#ffffff' : '#1e293b', textShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'}}>
            🚀 Empowering learners and organizations with AI-driven personalized learning paths
          </p>
        </div>

        <div className="user-cards" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', width: '100%', padding: '0 3rem 3rem'}}>
          <div className="user-card" onClick={() => navigate('/learner')} style={{
            background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(203, 213, 225, 0.5)',
            border: isDarkMode ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid rgba(100, 116, 139, 0.2)'
          }}>
            <div className="user-icon">👨‍🎓</div>
            <h3 className="user-title" style={{color: isDarkMode ? '#f1f5f9' : '#1e293b'}}>Learner Path</h3>
            <p className="user-description" style={{color: isDarkMode ? '#cbd5e1' : '#475569'}}>Personalized AI learning journey</p>
            <ul className="user-features" style={{listStyle: 'none', textAlign: 'left', color: isDarkMode ? '#94a3b8' : '#64748b'}}>
              <li>AI-powered recommendations</li>
              <li>Personalized learning paths</li>
              <li>Progress tracking</li>
              <li>Interactive courses</li>
            </ul>
          </div>

          <div className="user-card" onClick={() => navigate('/company')} style={{
            background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(203, 213, 225, 0.5)',
            border: isDarkMode ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid rgba(100, 116, 139, 0.2)'
          }}>
            <div className="user-icon">🏢</div>
            <h3 className="user-title" style={{color: isDarkMode ? '#f1f5f9' : '#1e293b'}}>Company Workers</h3>
            <p className="user-description" style={{color: isDarkMode ? '#cbd5e1' : '#475569'}}>Team learning management</p>
            <ul className="user-features" style={{listStyle: 'none', textAlign: 'left', color: isDarkMode ? '#94a3b8' : '#64748b'}}>
              <li>Team analytics</li>
              <li>Course management</li>
              <li>Progress reports</li>
              <li>Custom courses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
