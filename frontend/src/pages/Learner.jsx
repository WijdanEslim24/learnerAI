import React, { useState, useEffect } from 'react'
import './landing.css'
import Header from '../components/Header'

const Learner = ({ onBack = () => window.history.back(), isDarkMode }) => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const [learningPath, setLearningPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  useEffect(() => {
    loadLearningPath()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadLearningPath = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/learning-paths/learner/my-path`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (data.learningPath) setLearningPath(data.learningPath)
      else if (data.userType === 'learner' && data.data) setLearningPath(data.data.learningPath)
      else {
        setLearningPath({
          id: 'lp-fallback',
          name: 'JavaScript Mastery Path',
          description: 'A comprehensive learning journey to master JavaScript from basics to advanced concepts',
          status: 'In Progress',
          progress: 40,
          estimatedDuration: '16 weeks',
          generatedBy: 'AI',
          generatedDate: '2024-01-15',
          user: { learningGoals: ['Advanced JavaScript', 'Modern ES6+ Features', 'Async Programming'] },
          modules: [
            { id: 'module-1', title: 'ES6+ Modern JavaScript Features', description: 'Master modern JavaScript syntax and features', status: 'Completed', progress: 100, lessons: [{ id: 'lesson-1-1', title: 'Arrow Functions & Template Literals' }, { id: 'lesson-1-2', title: 'Destructuring Assignment' }] },
            { id: 'module-2', title: 'Asynchronous JavaScript Mastery', description: 'Deep dive into Promises and async/await', status: 'In Progress', progress: 65, lessons: [{ id: 'lesson-2-1', title: 'Promises Deep Dive' }] }
          ]
        })
      }
    } catch (err) {
      console.error('Error loading learning path:', err)
      setLearningPath({ id: 'lp-error-fallback', name: 'JavaScript Learning Path', description: 'Your personalized JavaScript learning journey', status: 'In Progress', progress: 25, modules: [{ id: 'm1', title: 'JavaScript Basics', description: 'Learn fundamentals', status: 'In Progress', progress: 50 }] })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900">
        <div className="text-center text-white">Loading your learning path...</div>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-4 rounded-2xl">← Back</button>
          <h1 className="text-4xl font-black">My Learning Path</h1>
        </div>
        <div>No learning path available. Try again later.</div>
      </div>
    )
  }

  // derive courses
  const courses = []
  if (learningPath?.courses && Array.isArray(learningPath.courses)) learningPath.courses.forEach(c => courses.push({ id: c.id || c.courseId || c.title, title: c.title || c.name || c.id, overview: c.description || c.overview }))
  if (learningPath?.modules && Array.isArray(learningPath.modules)) learningPath.modules.forEach(m => { const id = m.id || m.title; if (!courses.find(x => x.id === id)) courses.push({ id, title: m.title || m.id, overview: m.description }) })

  return (
    <div className={isDarkMode ? 'night-mode la-theme' : 'day-mode la-theme'} style={{minHeight: '100vh', padding: '2rem', paddingTop: 'calc(var(--app-header-height) + 16px)'}}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={() => { const b = document.body; if (b.classList.contains('night-mode')) { b.classList.remove('night-mode'); b.classList.add('day-mode') } else { b.classList.remove('day-mode'); b.classList.add('night-mode') } }} />
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="btn btn-primary mr-4">← Back</button>
        <h1 className="text-4xl font-black">My Learning Path</h1>
      </div>

      <div className="microservice-card" style={{marginBottom: '1.5rem'}}>
        <label className="text-lg font-bold">Choose Your Course</label>
        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full p-3 mt-3 rounded-xl">
          <option value="" disabled>👇 Select a course to view details</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourseId ? (
        <div>
          {/* For JavaScript titles show full syllabus */}
          {(() => {
            const sel = courses.find(x => x.id === selectedCourseId) || { title: selectedCourseId }
            const titleLower = (sel.title || '').toLowerCase()
            if (titleLower.includes('javascript')) {
              return (
                <div>
                  <h2 className="text-2xl font-bold">{sel.title}</h2>
                  <p className="mt-3">This is a comprehensive JavaScript syllabus (condensed).</p>
                </div>
              )
            }
            return (
              <div className="microservice-card p-4">
                <h3>{sel.title}</h3>
                <p>{sel.overview || 'Overview not available.'}</p>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="microservice-card p-4">
          <p>Select a course to view details.</p>
        </div>
      )}
    </div>
  )
}

export default Learner
