import React, { useEffect, useRef, useState } from 'react'
import './header.css'

const Header = ({ isDarkMode, setIsDarkMode }) => {
  const ref = useRef(null)
  const [showImage, setShowImage] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const setHeight = () => {
      const h = el.getBoundingClientRect().height
      document.documentElement.style.setProperty('--app-header-height', `${h}px`)
    }
    setHeight()
    window.addEventListener('resize', setHeight)
    return () => window.removeEventListener('resize', setHeight)
  }, [])

  const toggle = () => {
    if (typeof setIsDarkMode === 'function') {
      setIsDarkMode(!isDarkMode)
    } else {
      // fallback: toggle body classes
      const body = document.body
      if (body.classList.contains('night-mode')) {
        body.classList.remove('night-mode')
        body.classList.add('day-mode')
      } else {
        body.classList.remove('day-mode')
        body.classList.add('night-mode')
      }
    }
  }

  // prefer svg logos placed in public/; these approximate the provided branding
  const logoSrc = isDarkMode ? 'dark.png' : 'light.png'

  return (
    <header ref={ref} className={`la-header ${isDarkMode ? 'night' : 'day'}`}>
      {/* logo at left edge */}
      <div className="la-logo-wrap">
        {showImage ? (
          <img src={logoSrc} alt="LearnerAI logo" className="la-logo" onError={() => setShowImage(false)} onLoad={() => setShowImage(true)} />
        ) : (
          <div className="la-logo-fallback" aria-hidden>
            {/* simple circular monogram fallback */}
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" fill={isDarkMode ? '#0f172a' : '#e6f4ef'} stroke={isDarkMode ? '#2dd4bf' : '#0f766e'} strokeWidth="2" />
              <text x="50%" y="54%" textAnchor="middle" fontSize="20" fontWeight="700" fill={isDarkMode ? '#9ae6b4' : '#0f172a'}>E</text>
            </svg>
          </div>
        )}
      </div>

      <div className="la-header-inner">
        <div className="la-title-wrap">
          <div className="la-title">LearnerAI</div>
          <div className="la-subtitle">🚀 Empowering learners and organizations with AI-driven personalized learning paths</div>
        </div>
      </div>

      {/* controls pinned to right edge */}
      <div className="la-controls">
        <button className="la-theme-toggle" onClick={toggle} aria-label="Toggle theme">{isDarkMode ? '☀️' : '🌙'}</button>
      </div>
    </header>
  )
}

export default Header

