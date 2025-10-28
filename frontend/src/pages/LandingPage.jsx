import React, { useState, useEffect } from 'react'
import { getUserType } from '../services/api'
import './landing.css'
import Header from '../components/Header'

// helper: initials for avatars
const getInitials = (name = '') => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const LandingPage = () => {
  // API base: allow pointing to real backend via VITE_API_BASE, fallback to localhost mock
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  const [selectedView, setSelectedView] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Theme toggle functionality
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.body.classList.remove('day-mode')
        document.body.classList.add('night-mode')
      } else {
        document.body.classList.remove('night-mode')
      document.body.classList.add('day-mode')
      }
    } catch (e) {
      // ignore (SSR or test environments)
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleViewSelection = async (viewType) => {
    // Immediately navigate to the requested view to avoid blocking the UI.
    // Fetch userType in the background and reconcile if the server returns a different role.
    setSelectedView(viewType)
    try {
      const data = await getUserType(viewType)
      if (data && data.userType && data.userType !== viewType) {
        // If server indicates a different user type, update view silently.
        setSelectedView(data.userType)
      }
    } catch (error) {
      // Don't block navigation for network errors; just log.
      console.warn('Background userType fetch failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-pink-500/30 border-t-pink-500 mx-auto mb-8"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-purple-500 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            <div className="absolute inset-2 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 animate-spin mx-auto" style={{animationDuration: '2s'}}></div>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Loading...</p>
          <p className="text-white/70 text-lg">Preparing your amazing experience</p>
        </div>
      </div>
    )
  }

  if (selectedView === 'learner') {
    return (
      <div style={{paddingTop: 'var(--app-header-height)'}}>
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <LearnerView onBack={() => setSelectedView(null)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    )
  }

  if (selectedView === 'company') {
    return (
      <div style={{paddingTop: 'var(--app-header-height)'}}>
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <CompanyView onBack={() => setSelectedView(null)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'night-mode la-theme' : 'day-mode la-theme'} style={{minHeight: '100vh', display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden', paddingTop: 'var(--app-header-height)'}}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {/* Theme toggle moved to shared Header component */}

      {/* Design System Background Animation */}
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
        {/* Main heading with Dark Emerald styling */}
        <div className="mb-20 text-center" style={{padding: '2rem 3rem 0'}}>
  
    
        </div>
        
        {/* Design System Buttons */}
        <div className="user-cards" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', width: '100%', padding: '0 3rem 3rem'}}>
          <div className="user-card" onClick={() => handleViewSelection('learner')} style={{
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
          
          <div className="user-card" onClick={() => handleViewSelection('company')} style={{
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
        
        {/* Vibrant feature indicators */}
        <div className="mt-20 text-center" style={{padding: '0 3rem 3rem'}}>
          <div className="inline-flex items-center space-x-12" style={{color: isDarkMode ? '#e2e8f0' : '#334155'}}>
            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-full px-6 py-3 border" style={{
              background: isDarkMode 
                ? 'linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(20, 184, 166, 0.3))'
                : 'linear-gradient(to right, rgba(6, 182, 212, 0.2), rgba(20, 184, 166, 0.2))',
              borderColor: isDarkMode ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.3)'
            }}>
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold" style={{color: isDarkMode ? '#f1f5f9' : '#1e293b'}}>🤖 AI-Powered</span>
            </div>
            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-full px-6 py-3 border" style={{
              background: isDarkMode 
                ? 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))'
                : 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'
            }}>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-lg font-semibold" style={{color: isDarkMode ? '#f1f5f9' : '#1e293b'}}>✨ Personalized</span>
            </div>
            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-full px-6 py-3 border" style={{
              background: isDarkMode 
                ? 'linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(20, 184, 166, 0.3))'
                : 'linear-gradient(to right, rgba(6, 182, 212, 0.2), rgba(20, 184, 166, 0.2))',
              borderColor: isDarkMode ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.3)'
            }}>
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-lg font-semibold" style={{color: isDarkMode ? '#f1f5f9' : '#1e293b'}}>📊 Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Learner View - Shows AI-generated learning path topics
const LearnerView = ({ onBack, isDarkMode, setIsDarkMode }) => {
  const [learningPath, setLearningPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  // Theme toggle functionality for LearnerView
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.body.classList.remove('day-mode')
        document.body.classList.add('night-mode')
      } else {
        document.body.classList.remove('night-mode')
        document.body.classList.add('day-mode')
      }
    } catch (e) {
      // ignore (SSR or test environments)
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    loadLearningPath()
  }, [])

  const loadLearningPath = async () => {
    try {
      console.log('API_BASE:', API_BASE)
      console.log('Fetching learning path from:', `${API_BASE}/api/learning-paths/learner/my-path`)
      const response = await fetch(`${API_BASE}/api/learning-paths/learner/my-path`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      console.log('Learning Path:', data.learningPath) // Debug log
      console.log('User:', data.learningPath?.user) // Debug log
      
      // Check if we have the expected data structure
      if (data.learningPath) {
        console.log('Setting learning path with data.learningPath')
        setLearningPath(data.learningPath)
      } else if (data.userType === 'learner' && data.data) {
        // Handle alternative data structure
        console.log('Setting learning path with data.data.learningPath')
        setLearningPath(data.data.learningPath)
      } else {
        console.error('Unexpected data structure:', data)
        // Fallback: create a mock learning path if no data
        setLearningPath({
          id: 'lp-fallback',
          name: 'JavaScript Mastery Path',
          description: 'A comprehensive learning journey to master JavaScript from basics to advanced concepts',
          status: 'In Progress',
          progress: 40,
          estimatedDuration: '16 weeks',
          generatedBy: 'AI',
          generatedDate: '2024-01-15',
          user: {
            learningGoals: ['Advanced JavaScript', 'Modern ES6+ Features', 'Async Programming', 'Performance Optimization']
          },
          modules: [
            {
              id: 'module-1',
              title: 'ES6+ Modern JavaScript Features',
              description: 'Master modern JavaScript syntax and features',
              status: 'Completed',
              progress: 100,
              lessons: [
                { id: 'lesson-1-1', title: 'Arrow Functions & Template Literals', duration: '2 hours', status: 'Completed', score: 92 },
                { id: 'lesson-1-2', title: 'Destructuring Assignment', duration: '1.5 hours', status: 'Completed', score: 88 }
              ]
            },
            {
              id: 'module-2',
              title: 'Asynchronous JavaScript Mastery',
              description: 'Deep dive into Promises, async/await, and advanced async patterns',
              status: 'In Progress',
              progress: 65,
              lessons: [
                { id: 'lesson-2-1', title: 'Promises Deep Dive', duration: '3 hours', status: 'Completed', score: 87 },
                { id: 'lesson-2-2', title: 'Async/Await Patterns', duration: '2.5 hours', status: 'In Progress', score: null }
              ]
            }
          ],
          aiRecommendations: [
            {
              type: 'skill_gap',
              message: 'Focus on error handling patterns - this is crucial for production-ready async code',
              priority: 'high'
            },
            {
              type: 'next_steps',
              message: 'Consider practicing with real-world async scenarios before moving to advanced concepts',
              priority: 'medium'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error loading learning path:', error)
      console.error('Error details:', error.message)
      
      // Set fallback data on error
      setLearningPath({
        id: 'lp-error-fallback',
        name: 'JavaScript Learning Path',
        description: 'Your personalized JavaScript learning journey',
        status: 'In Progress',
        progress: 25,
        estimatedDuration: '12 weeks',
        generatedBy: 'AI',
        generatedDate: '2024-01-15',
        user: {
          learningGoals: ['Learn JavaScript Fundamentals', 'Master ES6+ Features', 'Understand Async Programming']
        },
        modules: [
          {
            id: 'module-1',
            title: 'JavaScript Basics',
            description: 'Learn the fundamentals of JavaScript programming',
            status: 'In Progress',
            progress: 50,
            lessons: [
              { id: 'lesson-1-1', title: 'Variables and Data Types', duration: '2 hours', status: 'Completed', score: 85 },
              { id: 'lesson-1-2', title: 'Functions and Scope', duration: '3 hours', status: 'In Progress', score: null }
            ]
          }
        ],
        aiRecommendations: [
          {
            type: 'learning_path',
            message: 'Continue with the fundamentals before moving to advanced topics',
            priority: 'medium'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-8"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-purple-500 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            <div className="absolute inset-2 rounded-full h-16 w-16 border-4 border-transparent border-t-pink-500 animate-spin mx-auto" style={{animationDuration: '2s'}}></div>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Loading your learning path...</p>
          <p className="text-white/70 text-lg">Fetching personalized content</p>
        </div>
      </div>
    )
  }

  // Show message if no learning path data is available
  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 p-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-400/30 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">←</span>
              <span className="font-bold text-lg">Back</span>
            </div>
          </button>
          <h1 className="text-4xl font-black text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Learning Path</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-800/40 to-orange-800/40 backdrop-blur-sm rounded-2xl p-8 border border-red-400/20 shadow-2xl text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Learning Path Available</h2>
            <p className="text-slate-300 text-lg mb-6">
              We couldn't load your learning path data. This might be due to:
            </p>
            <div className="text-left max-w-2xl mx-auto space-y-3 text-slate-300">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                <span>API server is not running</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                <span>Network connection issues</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                <span>Learning path data not found</span>
              </div>
            </div>
            <button
              onClick={() => loadLearningPath()}
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen la-theme p-8" style={{position: 'relative', overflow: 'hidden'}}>
      {/* Theme toggle moved to shared Header component */}

      {/* Background Animation */}
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

      {/* Header with Back Button */}
      <div className="flex items-center mb-8" style={{position: 'relative', zIndex: 10}}>
        <button
          onClick={onBack}
          className="btn btn-primary mr-4"
        >
            <span className="text-xl">←</span>
            <span className="font-bold text-lg">Back</span>
        </button>
        <h1 className="text-4xl font-black" style={{
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>My Learning Path</h1>
      </div>

      {/* Learning Path Overview removed per user request */}

      {/* My Learning Path header + course selector */}
      <div className="microservice-card" style={{position: 'relative', zIndex: 10, marginBottom: '2rem'}}>
       

        {/* derive a list of all courses from learningPath */}
        {(() => {
          const courses = []
          if (learningPath?.courses && Array.isArray(learningPath.courses)) {
            learningPath.courses.forEach(c => courses.push({ id: c.id || c.courseId || c.title, title: c.title || c.name || c.id, overview: c.description || c.overview }))
          }
          if (learningPath?.modules && Array.isArray(learningPath.modules)) {
            learningPath.modules.forEach(m => {
              // treat modules as courses if no explicit courses array
              const id = m.id || m.title
              const title = m.title || m.id
              if (!courses.find(x => x.id === id)) courses.push({ id, title, overview: m.description })
            })
          }

          // de-duplicate
          const dedup = Array.from(new Map(courses.map(it => [it.id, it])).values())

          if (dedup.length === 0) {
            return <div className="text-slate-400">No courses found for this learning path.</div>
          }

          return (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)',
                  fontSize: '1.5rem'
                }}>
                  📚
                </div>
                <div>
                  <label className="text-lg font-bold" style={{color: 'var(--text-primary)', display: 'block'}}>
                    Choose Your Course
                  </label>
                  <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                    Select from available courses
                  </p>
                </div>
              </div>
              
              <div 
                className="course-selector"
                style={{
                  position: 'relative',
                  background: 'var(--gradient-card)',
                  border: '2px solid var(--bg-tertiary)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(6, 95, 70, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full outline-none"
                  style={{ 
                    color: 'var(--text-primary)', 
                    background: 'var(--bg-card)',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    appearance: 'none',
                    textAlign: 'center',
                    backgroundImage: isDarkMode 
                      ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23ffffff\' stroke=\'none\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")'
                      : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23334155\' stroke=\'none\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px 20px',
                    paddingRight: '45px'
                  }}
                >    <option value="" disabled>👇 Select a course to view details</option>
                {dedup.map(c => (
                    <option key={c.id} value={c.id} style={{textAlign: 'center'}}>{c.title}</option>
                ))}
              </select>
              
              </div>
            </div>
          )
        })()}
      </div>

      {/* Course Details: show full syllabus when a JavaScript course is selected, otherwise a compact card */}
      <div style={{position: 'relative', zIndex: 10}}>
      {selectedCourseId && (() => {
        const all = []
        if (learningPath?.courses && Array.isArray(learningPath.courses)) {
          learningPath.courses.forEach(c => all.push({ id: c.id || c.courseId || c.title, title: c.title || c.name || c.id, overview: c.description || c.overview }))
        }
        if (learningPath?.modules && Array.isArray(learningPath.modules)) {
          learningPath.modules.forEach(m => {
            const id = m.id || m.title
            if (!all.find(x => x.id === id)) all.push({ id, title: m.title || m.id, overview: m.description })
          })
        }
        const sel = all.find(x => x.id === selectedCourseId) || { title: selectedCourseId }
        const titleLower = (sel.title || '').toLowerCase()

        if (titleLower.includes('javascript') || titleLower.includes('javascript foundations')) {
          return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              {/* Course Hero Section */}
              <div className="microservice-card" style={{
                padding: '2.5rem',
                background: 'var(--gradient-card)',
                borderLeft: '4px solid var(--primary-cyan)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem'}}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)'
                  }}>
                    📘
              </div>
                <div>
                    <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem'}}>COURSE</div>
                    <h2 style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      JavaScript Foundations: From Zero to Confident Coder
                    </h2>
                </div>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)',
                  marginTop: '1rem'
                }}>
                  This course is designed for absolute beginners who want to build a solid understanding of JavaScript — the core programming language of the web. By the end of the course, learners will be able to read, write, and debug JavaScript code confidently, understand how to manipulate web pages dynamically, and apply logical thinking to build small, interactive projects.
                </p>
                </div>

              {/* Target Skills Section */}
              <div className="microservice-card" style={{padding: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ✨
                </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>What You'll Master</h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem'
                }}>
                  {[
                    'Understanding JavaScript syntax and structure',
                    'Working with variables, data types, and operators',
                    'Writing control flow with conditionals and loops',
                    'Creating and using functions effectively',
                    'Manipulating arrays and objects',
                    'Understanding scope, hoisting, and events',
                    'Interacting with the DOM',
                    'Handling user input and basic debugging'
                  ].map((skill, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--bg-tertiary)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{color: 'var(--accent-green)', fontSize: '1.2rem'}}>✓</div>
                      <span style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>{skill}</span>
                    </div>
                  ))}
                </div>
                </div>

              {/* Course Modules Section */}
              <div className="microservice-card" style={{padding: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📚
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>Course Modules</h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {[
                    { title: 'Getting Started with JavaScript', obj: 'Understand what JavaScript is, how it works in the browser, and how to set up your development environment.', skills: 'Understanding JavaScript\'s role in web development; setting up tools (browser, editor, console); writing and running your first script.' },
                    { title: 'Core Syntax and Data Types', obj: 'Learn the building blocks of JavaScript code: variables, data types, and operators.', skills: 'Declaring variables (var, let, const); understanding data types; using arithmetic and logical operators.' },
                    { title: 'Control Flow — Logic in Action', obj: 'Master the use of conditionals and loops to control program behavior.', skills: 'Writing conditional statements; creating loops for repetition; using logical operators effectively.' },
                    { title: 'Functions and Scope', obj: 'Learn how to organize and reuse code through functions.', skills: 'Declaring and invoking functions; understanding parameters and return values; recognizing scope and hoisting.' },
                    { title: 'Working with Arrays and Objects', obj: 'Understand how to handle collections of data effectively.', skills: 'Creating and manipulating arrays; working with objects and key-value pairs.' },
                    { title: 'DOM Manipulation & Events', obj: 'Learn how JavaScript interacts with HTML to create dynamic web experiences.', skills: 'Selecting and modifying HTML elements; handling events like clicks and input changes.' },
                    { title: 'Debugging and Problem Solving', obj: 'Develop confidence in identifying and fixing errors in your code.', skills: 'Using browser dev tools effectively; reading error messages and stack traces; implementing debugging techniques.' },
                    { title: 'Mini Projects for Mastery', obj: 'Apply everything learned through practical, hands-on projects.', skills: 'Integrating all foundational JS skills; building functional mini-apps (calculator, to-do list, quiz game, etc.).' }
                  ].map((module, idx) => (
                    <div key={idx} style={{
                      padding: '1.5rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      border: '1px solid var(--bg-tertiary)',
                      borderLeft: '3px solid var(--primary-cyan)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                      }}>
                        {idx + 1}
                      </div>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem'
                      }}>
                        {module.title}
                      </h4>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem'
                      }}>
                        <strong style={{color: 'var(--text-primary)'}}>Objective:</strong> {module.obj}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <strong style={{color: 'var(--text-primary)'}}>Skills:</strong> {module.skills}
                      </div>
                    </div>
                  ))}
                </div>
                </div>

              {/* Assessment Section */}
              <div className="microservice-card" style={{padding: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--gradient-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🎯
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>Learning Activities & Assessment</h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {[
                    { title: 'Interactive Code Exercises', desc: 'Short coding tasks in each lesson' },
                    { title: 'Mini Projects', desc: 'Practical web-based apps after Modules 6–8' },
                    { title: 'Concept Quizzes', desc: 'Multiple-choice questions to test comprehension' },
                    { title: 'Debugging Challenges', desc: 'Identify and fix broken snippets' },
                    { title: 'Final Project', desc: 'Combine all concepts to build an interactive web app' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px',
                      border: '1px solid var(--bg-tertiary)'
                    }}>
                      <div style={{
                        fontSize: '1.5rem'
                      }}>
                        {['⚡', '🎨', '📝', '🐛', '🏆'][idx]}
                      </div>
                <div>
                        <h5 style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'var(--text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {item.title}
                        </h5>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          margin: 0
                        }}>
                          {item.desc}
                        </p>
                </div>
              </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        // non-JS fallback: compact details
        return (
          <div className="microservice-card" style={{padding: '1.5rem', marginBottom: '2rem'}}>
            <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>{sel.title}</h3>
            <p style={{color: 'var(--text-secondary)'}}>{sel.overview || 'Course overview not available for this course.'}</p>
          </div>
        )
      })()}
      </div>

      {/* 'Learning Journey - Step by Step' section removed per request */}
    </div>
  )
}

// Company View - Shows workers with dropdown choice lists
const CompanyView = ({ onBack, isDarkMode, setIsDarkMode }) => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [showCourseSearch, setShowCourseSearch] = useState(false)
  const [showWorkerSearch, setShowWorkerSearch] = useState(false)
  const [workerListFilter, setWorkerListFilter] = useState('')
  const [courseQuery, setCourseQuery] = useState('')
  const [workerQuery, setWorkerQuery] = useState('')
  const [courseResults, setCourseResults] = useState([])
  const [workerResults, setWorkerResults] = useState([])
  const [courseLoading, setCourseLoading] = useState(false)
  const [workerLoading, setWorkerLoading] = useState(false)
  const [courseError, setCourseError] = useState(null)
  const [workerError, setWorkerError] = useState(null)
  const [coursePathExpanded, setCoursePathExpanded] = useState(false)
  const [courseSearched, setCourseSearched] = useState(false)
  const [workerSearched, setWorkerSearched] = useState(false)

  useEffect(() => {
    loadWorkers()
  }, [])

  // Map compact company mock structure into the frontend-compatible workers shape
  const mapCompanyToWorkers = (companyData) => {
    if (!companyData || !Array.isArray(companyData.workers)) return []
    return (companyData.workers || []).map(w => {
      // Build per-course details from the compact mock shape when available
      const courses = (w.courses || []).map(c => {
        const lpInfo = (c.learningPaths && c.learningPaths[0]) ? c.learningPaths[0] : null
        const modules = lpInfo?.modules || []
        // Heuristic progress: prefer explicit `progress` if present, otherwise use expanded flag as a hint
        const progress = typeof lpInfo?.progress === 'number' ? lpInfo.progress : (lpInfo ? (lpInfo.expanded ? 60 : 10) : 0)
        const status = lpInfo ? (lpInfo.expanded ? 'In Progress' : 'Not Started') : 'Not Started'
        return {
          id: c.id,
          title: c.name,
          status,
          progress,
          modules,
          learningPathId: lpInfo?.id || null,
          generatedAt: lpInfo?.generatedAt || null,
          summary: lpInfo?.summary || null,
          duration: c.duration || '10 hours'
        }
      })

      // Aggregate a simple overall progress for the worker (average of course progresses)
      const overallProgress = courses.length > 0 ? Math.round(courses.reduce((s, cur) => s + (cur.progress || 0), 0) / courses.length) : 0
      // Derive earliest start date from courses' generatedAt values
      const startDates = courses.map(c => c.generatedAt).filter(Boolean).sort()
      const startDate = startDates.length > 0 ? startDates[0] : null

      const lp = {
        id: `lp-${w.workerId}`,
        name: `${w.workerName} Learning Path`,
        status: overallProgress >= 100 ? 'Completed' : (overallProgress > 0 ? 'In Progress' : 'Not Started'),
        progress: overallProgress,
        startDate,
        estimatedCompletion: null,
        courses
      }

      return {
        id: w.workerId,
        name: w.workerName,
        email: w.email || `${w.workerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        department: 'Engineering',
        position: 'Employee',
        hireDate: null,
        learningPath: lp,
        skillGaps: [],
        lastAssessment: null,
        assessmentScore: null,
        nextReview: null
      }
    })
  }

  const loadWorkers = async () => {
    try {
      // Primary: try the configured API base (could be mock server or real backend)
      const response = await fetch(`${API_BASE}/api/workers`)
      if (response.ok) {
        const data = await response.json()
        // prefer compatibility-shaped workers if provided
        if (Array.isArray(data.workers) && data.workers.length > 0) {
          setWorkers(data.workers)
          setLoading(false)
          return
        }
        // sometimes the mock endpoint returns rawCompany
        if (data.rawCompany && data.rawCompany.workers) {
          const mapped = mapCompanyToWorkers(data.rawCompany)
          setWorkers(mapped)
          setLoading(false)
          return
        }
      }
    } catch (error) {
      console.warn('Primary fetch failed, will attempt local mock fallback:', error.message || error)
    }

    // Fallback: try to load the static mock file served from the frontend public folder
    try {
      const res2 = await fetch('/mock/company-mock.json')
      if (res2.ok) {
        const companyData = await res2.json()
        const mapped = mapCompanyToWorkers(companyData)
        setWorkers(mapped)
        setLoading(false)
        return
      }
    } catch (err) {
      console.error('Fallback mock load failed:', err)
    }

    // If everything fails, set empty
    setWorkers([])
    setLoading(false)
  }

  const handleWorkerChange = (workerId) => {
    setSelectedWorker(workerId)
    setSelectedCourse('') // Reset course selection when worker changes
  }

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId)
  }

  const getSelectedWorker = () => {
    return workers.find(worker => worker.id === selectedWorker)
  }

  const getSelectedCourse = () => {
    const worker = getSelectedWorker()
    if (!worker) return null
    return worker.learningPath.courses?.find(course => course.id === selectedCourse)
  }

  // Collapse the learning path view whenever the selected worker or course changes
  useEffect(() => {
    setCoursePathExpanded(false)
  }, [selectedWorker, selectedCourse])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-500/30 border-t-emerald-500 mx-auto mb-8"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-teal-500 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            <div className="absolute inset-2 rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-500 animate-spin mx-auto" style={{animationDuration: '2s'}}></div>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Loading workers...</p>
          <p className="text-white/70 text-lg">Fetching team data</p>
        </div>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'night-mode la-theme' : 'day-mode la-theme'} style={{minHeight: '100vh', display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden'}}>
      {/* Theme toggle moved to shared Header component */}

      {/* Design System Background Animation */}
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

      <div className="w-full p-8 relative z-10">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
            className="btn btn-primary mr-4"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)',
              transition: 'all 0.3s ease'
            }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">←</span>
            <span className="font-bold text-lg">Back</span>
          </div>
        </button>
          <h1 className="text-4xl font-black" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Company Workers</h1>
      </div>

        <div className="w-full max-w-full" style={{padding: '0 3rem'}}>
        
        {/* Top search buttons removed per design — search is now inline and simplified */}

        {/* Simplified Instructions */}
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
            👥 Choose a Worker
          </p>
          <p className="text-sm mt-2" style={{color: 'var(--text-secondary)'}}>
            Select a worker to view their courses and progress
          </p>
        </div>

        {/* Main Content Layout - Two Column Grid (becomes 50:50 when worker+course selected) */}
        <div
          className="grid"
          style={{
            maxWidth: '1800px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: (selectedWorker && selectedCourse) ? '1fr 1fr' : '1fr'
          }}
        >
          {/* Left Column: Worker and Course Selection */}
          <div className="space-y-6">
          {/* Card 1: Choose Worker */}
          <div className="microservice-card" style={{padding: '1.5rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '16px'}}>
            <div className="mb-4">
              <h3 className="font-semibold mb-3" style={{color: 'var(--text-primary)'}}>📋 All Workers ({workers?.length || 0})</h3>
              
              {/* Worker list displayed as a single-column selectable LIST (matches the attached example) */}
              <div style={{maxWidth: '520px', margin: '0 auto'}}>
                {/* Inline filter for workers */}
                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                  <input
                    type="text"
                    value={workerListFilter}
                    onChange={(e) => setWorkerListFilter(e.target.value)}
                    placeholder="Search workers by name..."
                    className="p-2 rounded-md"
                    style={{flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)'}}
                  />
                  <button
                    onClick={() => setWorkerListFilter('')}
                    className="px-3 py-2 rounded-md"
                    style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)'}}
                  >Clear</button>
                </div>

                <div style={{maxHeight: '320px', overflowY: 'auto'}}>
                  <select
                    value={selectedWorker || ''}
                    onChange={(e) => handleWorkerChange(e.target.value)}
                    size={8}
                    className="w-full"
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--bg-tertiary)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* optional placeholder */}
                    <option value="" disabled style={{color: 'var(--text-secondary)'}}>Select a worker...</option>
                    {(() => {
                      const q = (workerListFilter || '').trim().toLowerCase()
                      const visible = q ? (workers || []).filter(w => (w.name || '').toLowerCase().includes(q)) : (workers || [])
                      if (visible.length === 0) {
                        return <option value="" disabled style={{color: 'var(--text-secondary)'}}>No results found.</option>
                      }
                      return visible.map((worker) => (
                        <option key={worker.id} value={worker.id} style={{padding: '6px 8px'}}>{worker.name}</option>
                      ))
                    })()}
                  </select>
                </div>
              </div>
            </div>
                  </div>
                  
          {/* Card 2: Choose Course (only show if worker selected) */}
          {selectedWorker && (
            <div className="microservice-card" style={{padding: '1.5rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '16px'}}>
              <div className="mb-4">
                <h3 className="font-semibold mb-3" style={{color: 'var(--text-primary)'}}>
                  📚 Courses for {workers?.find(w => w.id === selectedWorker)?.name}
                </h3>
                
                {/* Compact course list */}
                <div className="space-y-3">
                  {getSelectedWorker()?.learningPath.courses?.map((course) => {
                    const isSelected = selectedCourse === course.id
                    return (
                      <div
                        key={course.id}
                        onClick={() => handleCourseChange(course.id)}
                        className="p-4 rounded-lg cursor-pointer transition-all duration-200"
                          style={{ 
                          background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                          border: isSelected ? '2px solid var(--primary-cyan)' : '1px solid var(--bg-tertiary)',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.target.style.background = 'var(--bg-tertiary)'
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.target.style.background = 'var(--bg-secondary)'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                            style={{
                              background: 'var(--gradient-primary)',
                              color: 'white'
                            }}
                          >
                            📘
                      </div>
                          <div className="flex-1">
                            <p className="font-semibold" style={{color: 'var(--text-primary)'}}>{course.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                course.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                course.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {course.status === 'Completed' ? '✅' : course.status === 'In Progress' ? '🔄' : '⏳'} {course.status || 'Not Started'}
                              </span>
                    </div>
                  </div>
                  </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Course Details moved to right column (now empty here) */}
          </div>
          
          {/* Right Column: Full Learning Path - compact by default with expand/collapse */}
          {selectedWorker && (
            <div className="lg:sticky lg:top-8" style={{alignSelf: 'flex-start', maxHeight: 'calc(100vh - 120px)', overflow: 'auto'}}>
              {/* Top: Course Details panel (shows when a course is selected) */}
              {selectedCourse ? (
                <div className="microservice-card" style={{padding: '2rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '16px', marginBottom: '1rem'}}>
                  {/* Title and Worker Name */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
                      {getSelectedCourse()?.title}
                    </h2>
                    <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>👤 {getSelectedWorker()?.name}</p>
                  </div>

                  {/* Course Details Table */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{borderColor: 'var(--bg-tertiary)'}}>
                      <span className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>Progress</span>
                      <span className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
                        {getSelectedCourse()?.status === 'Completed' ? '100%' :
                         getSelectedCourse()?.status === 'In Progress' ? '65%' : '0%'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b pb-3" style={{borderColor: 'var(--bg-tertiary)'}}>
                      <span className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>Status</span>
                      <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
                        getSelectedCourse()?.status === 'Completed' ? 'bg-green-500 text-white' :
                        getSelectedCourse()?.status === 'In Progress' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {getSelectedCourse()?.status === 'Completed' ? '✅ Completed' :
                         getSelectedCourse()?.status === 'In Progress' ? '🔄 In Progress' :
                         '⏳ Not Started'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b pb-3" style={{borderColor: 'var(--bg-tertiary)'}}>
                      <span className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>Duration</span>
                      <span className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>
                        {getSelectedCourse()?.duration || '10 hours'}
                      </span>
                    </div>

                    {getSelectedCourse()?.score && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>Score</span>
                        <span className="text-lg font-semibold" style={{color: 'var(--accent-green)'}}>{getSelectedCourse()?.score}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="microservice-card" style={{padding: '1.5rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '12px', marginBottom: '1rem'}}>
                  <p style={{color: 'var(--text-secondary)'}}>Select a course to view details.</p>
                </div>
              )}

              {/* Below: Learning Path (compact/expandable as before) */}
              {selectedWorker && selectedCourse && (
                <>
                  {!coursePathExpanded ? (
                    <div className="microservice-card" style={{padding: '1.25rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '12px'}}>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>📚 {getSelectedCourse()?.title} — Learning Path</h3>
                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>👤 {getSelectedWorker()?.name} • Summary view</p>
                      </div>

                      <div style={{display: 'grid', gap: '0.5rem'}}>
                        <div style={{padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', borderRadius: '8px'}}>
                          <p className="font-medium" style={{color: 'var(--text-primary)', marginBottom: '0.25rem'}}>Overview</p>
                          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>A condensed summary of the learning path. Expand to view all stages and detailed steps.</p>
                        </div>

                        <div style={{padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', borderRadius: '8px'}}>
                          <p className="font-semibold" style={{color: 'var(--text-primary)', marginBottom: '0.25rem'}}>Stage preview</p>
                          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Stage 1: The Foundation — core concepts and quick wins</p>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem'}}>
                          <button onClick={() => setCoursePathExpanded(true)} className="px-4 py-2 rounded-lg font-semibold" style={{background: 'var(--gradient-primary)', color: 'white', border: 'none', cursor: 'pointer'}}>View learning path</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="microservice-card" style={{padding: '2rem', background: 'var(--gradient-card)', border: '1px solid var(--bg-tertiary)', borderRadius: '16px'}}>
                      <div className="mb-6" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem'}}>
                        <div>
                          <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>📚 {getSelectedCourse()?.title} Learning Path</h2>
                          <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>👤 {getSelectedWorker()?.name} • Full path view</p>
                        </div>
                        <div style={{marginLeft: 'auto'}}>
                          <button onClick={() => setCoursePathExpanded(false)} className="px-3 py-2 rounded-md font-medium" style={{background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--bg-tertiary)'}}>Hide learning path</button>
                        </div>
                      </div>

                      <div className="space-y-6">
                            {(() => {
                              const courseTitleLower = (getSelectedCourse()?.title || '').toLowerCase()
                              if (courseTitleLower.includes('react')) {
                                // Detailed React Hooks Mastery syllabus (formatted)
                                return (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                      <button onClick={() => setCoursePathExpanded(false)} className="px-3 py-2 rounded-md" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>← Close Sidebar</button>
                                      <div style={{textAlign: 'center', flex: 1}}>
                                        <h2 className="text-2xl font-bold">📚 React Hooks Mastery Learning Path</h2>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>👤 {getSelectedWorker()?.name}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-6">
                                      <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                        <h3 className="text-xl font-bold mb-3">1 React Fundamentals</h3>
                                        <div className="space-y-3">
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">🎯 1 Introduction to React</div><div className="text-sm">1</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Components, JSX, and Virtual DOM</p>
                                          </div>
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">📘 2 Props and State</div><div className="text-sm">2</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Data flow in React applications</p>
                                          </div>
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">✨ 3 React Hooks Basics</div><div className="text-sm">3</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>useState, useEffect, and custom hooks</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                        <h3 className="text-xl font-bold mb-3">2 Advanced Patterns</h3>
                                        <div className="space-y-3">
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">🎯 4 Context API</div><div className="text-sm">4</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Global state management</p>
                                          </div>
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">📘 5 Performance Optimization</div><div className="text-sm">5</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Memo, Callback, and optimization techniques</p>
                                          </div>
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">✨ 6 Custom Hooks</div><div className="text-sm">6</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Building reusable hook logic</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                        <h3 className="text-xl font-bold mb-3">3 Real-World Projects</h3>
                                        <div className="space-y-3">
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">🎯 7 Project Implementation</div><div className="text-sm">7</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Build a complete React app</p>
                                          </div>
                                          <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                            <div className="flex items-center justify-between"><div className="font-semibold">📘 8 Testing & Debugging</div><div className="text-sm">8</div></div>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Testing strategies and tools</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }

                              // default: existing generic stages
                              return (
                                <>
                                  {/* Stage 1 */}
                                  <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                    <h3 className="text-xl font-bold mb-3" style={{color: 'var(--text-primary)'}}>Stage 1: The Foundation - Algorithmic and Code Efficiency</h3>
                                    <div className="space-y-3">
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 1: Theoretical Grounding</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Big O Notation and Amdahl's Law</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Graded Quiz on complexity</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 2: Profiling Fundamentals</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Benchmarking and Hotspot Identification</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Lab Challenge - Profile Report</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 3: Micro-Optimization</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Memory and Concurrency basics</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Peer Review</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stage 2 */}
                                  <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                    <h3 className="text-xl font-bold mb-3" style={{color: 'var(--text-primary)'}}>Stage 2: The Data Layer - Database and Caching Tuning</h3>
                                    <div className="space-y-3">
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 4: Query Analysis</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Execution Plans and Indexing</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Analyze 5 SQL queries</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 5: Caching Implementation</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Layered Caching (In-memory, CDN)</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Live Demo</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 6: Scaling Concepts</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Database Architecture</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Conceptual Exam</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stage 3 */}
                                  <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                    <h3 className="text-xl font-bold mb-3" style={{color: 'var(--text-primary)'}}>Stage 3: The Environment - Infrastructure and Network</h3>
                                    <div className="space-y-3">
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 7: System Tuning</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>OS and I/O optimization</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Configuration Audit</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 8: Network Efficiency</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Latency Reduction and Protocols</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Problem Solving</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 9: Scaling Architecture</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Load Balancing and Observability</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Integrated Project</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stage 4 */}
                                  <div className="border-l-4 pl-4" style={{borderColor: 'var(--primary-cyan)'}}>
                                    <h3 className="text-xl font-bold mb-3" style={{color: 'var(--text-primary)'}}>Stage 4: Mastery and Automation</h3>
                                    <div className="space-y-3">
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 10: Performance Testing</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Load, Stress, and Soak testing</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Testing Report</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                                        <p className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>Step 11: CI/CD Integration</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Automating Regression Checks</p>
                                        <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>🎯 Mastery Gate: Practical Task</p>
                                      </div>
                                      <div className="p-3 rounded-lg" style={{background: 'var(--gradient-primary)', border: '1px solid var(--primary-cyan)', borderRadius: '12px'}}>
                                        <p className="font-semibold mb-1" style={{color: 'white'}}>🏆 Step 12: Final Capstone Project</p>
                                        <p className="text-sm" style={{color: 'rgba(255,255,255,0.9)'}}>The Optimization Audit - Full Skill Synthesis</p>
                                        <p className="text-xs mt-1 font-bold" style={{color: 'white'}}>🎯 Mastery Gate: Complete Audit Report</p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            })()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default LandingPage