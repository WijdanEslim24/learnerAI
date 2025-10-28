import React, { useState, useEffect } from 'react'
import './landing.css'
import Header from '../components/Header'

const getInitials = (name = '') => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const mapCompanyToWorkers = (companyData) => {
  if (!companyData || !Array.isArray(companyData.workers)) return []
  return (companyData.workers || []).map(w => {
    const lp = {
      id: `lp-${w.workerId}`,
      name: `${w.workerName} Learning Path`,
      status: 'in_progress',
      progress: 0,
      courses: (w.courses || []).map(c => ({ id: c.id, title: c.name, status: 'Not Started', duration: '10 hours' }))
    }
    return { id: w.workerId, name: w.workerName, email: w.email || `${w.workerName.toLowerCase().replace(/\s+/g, '.')}@example.com`, learningPath: lp }
  })
}

const Company = ({ onBack = () => window.history.back(), isDarkMode }) => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [coursePathExpanded, setCoursePathExpanded] = useState(false)

  useEffect(() => { loadWorkers() }, [])

  const loadWorkers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/workers`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.workers) && data.workers.length > 0) { setWorkers(data.workers); setLoading(false); return }
        if (data.rawCompany && data.rawCompany.workers) { setWorkers(mapCompanyToWorkers(data.rawCompany)); setLoading(false); return }
      }
    } catch (err) {
      console.warn('Primary fetch failed:', err)
    }
    try {
      const res2 = await fetch('/mock/company-mock.json')
      if (res2.ok) { const companyData = await res2.json(); setWorkers(mapCompanyToWorkers(companyData)); setLoading(false); return }
    } catch (err) { console.error('Fallback load failed:', err) }
    setWorkers([]); setLoading(false)
  }

  const handleWorkerChange = (workerId) => { setSelectedWorker(workerId); setSelectedCourse('') }
  const handleCourseChange = (courseId) => { setSelectedCourse(courseId) }
  const getSelectedWorker = () => workers.find(w => w.id === selectedWorker)
  const getSelectedCourse = () => { const w = getSelectedWorker(); if (!w) return null; return w.learningPath.courses?.find(c => c.id === selectedCourse) }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading workers...</div>

  return (
    <div className={isDarkMode ? 'night-mode la-theme' : 'day-mode la-theme'} style={{minHeight: '100vh', paddingTop: 'var(--app-header-height)'}}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={() => { const b = document.body; if (b.classList.contains('night-mode')) { b.classList.remove('night-mode'); b.classList.add('day-mode') } else { b.classList.remove('day-mode'); b.classList.add('night-mode') } }} />
      <div className="flex items-center mb-8 p-6">
        <button onClick={onBack} className="mr-4 p-3 rounded-xl">← Back</button>
        <h1 className="text-4xl font-black">Company Workers</h1>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '0 2rem 3rem'}}>
        <div>
          <div className="microservice-card p-4 mb-4">
            <h3>All Workers ({workers.length})</h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {workers.map(worker => (
                <div key={worker.id} onClick={() => handleWorkerChange(worker.id)} className="p-3 rounded-lg cursor-pointer" style={{background: selectedWorker === worker.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'}}>
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center">{getInitials(worker.name)}</div><span>{worker.name}</span></div>
                </div>
              ))}
            </div>
          </div>

          {selectedWorker && (
            <div className="microservice-card p-4">
              <h3>Courses for {getSelectedWorker()?.name}</h3>
              <div className="space-y-3 mt-3">
                {getSelectedWorker()?.learningPath?.courses?.map(course => (
                  <div key={course.id} className="p-3 rounded-lg" onClick={() => handleCourseChange(course.id)} style={{background: selectedCourse === course.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'}}>
                    <div className="flex items-center justify-between"><div>{course.title}</div><div className="text-sm">{course.status}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {selectedCourse ? (
            <div className="microservice-card p-4">
              <h2>{getSelectedCourse()?.title}</h2>
              <p className="text-sm">Worker: {getSelectedWorker()?.name}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between"><span>Progress</span><strong>{getSelectedCourse()?.status === 'In Progress' ? '65%' : getSelectedCourse()?.status === 'Completed' ? '100%' : '0%'}</strong></div>
                <div className="mt-3">
                      {!coursePathExpanded ? (
                        <div>
                          <p>A condensed summary of the learning path. Expand to view all stages.</p>
                          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem'}}>
                            <button
                              onClick={() => setCoursePathExpanded(true)}
                              className="la-view-path-btn"
                              aria-expanded={coursePathExpanded}
                              aria-label="View learning path for selected course"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M3 7a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 3v4h4" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>View learning path</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{display: 'flex', justifyContent: 'flex-start'}}><h3>Full Learning Path</h3></div>
                          <div className="mt-3">(Detailed stages go here)</div>
                        </div>
                      )}
                </div>
              </div>
            </div>
          ) : (
            <div className="microservice-card p-4">Select a course to view details.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Company
