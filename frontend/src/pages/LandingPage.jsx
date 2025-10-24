import React, { useState, useEffect } from 'react'
import { getUserType } from '../services/api'

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

  const handleViewSelection = async (viewType) => {
    setLoading(true)
    try {
      const data = await getUserType(viewType)
      setSelectedView(data.userType)
    } catch (error) {
      console.error('Error loading view:', error)
      setSelectedView(viewType) // Fallback
    } finally {
      setLoading(false)
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
    return <LearnerView onBack={() => setSelectedView(null)} />
  }

  if (selectedView === 'company') {
    return <CompanyView onBack={() => setSelectedView(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
      </div>
      
      <div className="text-center relative z-10 max-w-5xl mx-auto px-6">
        {/* Main heading with vibrant styling */}
        <div className="mb-20">
          <h1 className="text-7xl font-black text-white mb-8 bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            LearnerAI
          </h1>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
            🚀 Empowering learners and organizations with 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold"> AI-driven</span> personalized learning paths
          </p>
        </div>
        
        {/* Vibrant button container */}
        <div className="flex flex-col lg:flex-row gap-10 justify-center items-center">
          <button
            onClick={() => handleViewSelection('learner')}
            className="group relative w-96 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold py-8 px-10 rounded-3xl text-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-6">
              <div className="text-5xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-12">👨‍🎓</div>
              <div className="text-left">
                <div className="text-2xl font-black">Learner Path</div>
                <div className="text-lg text-white/90 font-medium">Personalized AI learning journey</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
          </button>
          
          <button
            onClick={() => handleViewSelection('company')}
            className="group relative w-96 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold py-8 px-10 rounded-3xl text-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/50 border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-6">
              <div className="text-5xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-12">🏢</div>
              <div className="text-left">
                <div className="text-2xl font-black">Company Workers</div>
                <div className="text-lg text-white/90 font-medium">Team learning management</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
          </button>
        </div>
        
        {/* Vibrant feature indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-12 text-white/80">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-pink-400/30">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold">🤖 AI-Powered</span>
            </div>
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-400/30">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-lg font-semibold">✨ Personalized</span>
            </div>
            <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-emerald-400/30">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-lg font-semibold">📊 Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Learner View - Shows AI-generated learning path topics
const LearnerView = ({ onBack }) => {
  const [learningPath, setLearningPath] = useState(null)
  const [loading, setLoading] = useState(true)

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

      {/* Learning Path Overview */}
      <div className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-400/20 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {learningPath?.name}
            </h2>
            <p className="text-slate-300 mb-4 text-lg leading-relaxed">{learningPath?.description}</p>
          </div>
          <div className="ml-6 flex flex-col items-end">
            <div className="text-right mb-4">
              <div className="text-2xl font-bold text-white mb-1">{learningPath?.progress}%</div>
              <div className="text-slate-400 text-sm">Overall Progress</div>
            </div>
            <div className="w-40 bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${learningPath?.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20">
            <div className="text-2xl font-bold text-blue-300 mb-1">{learningPath?.estimatedDuration}</div>
            <div className="text-slate-400 text-sm">Estimated Duration</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/20">
            <div className="text-2xl font-bold text-purple-300 mb-1">{learningPath?.generatedBy}</div>
            <div className="text-slate-400 text-sm">Generated By</div>
          </div>
          <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 backdrop-blur-sm rounded-xl p-4 border border-pink-400/20">
            <div className="text-2xl font-bold text-pink-300 mb-1">{learningPath?.generatedDate}</div>
            <div className="text-slate-400 text-sm">Generated Date</div>
          </div>
        </div>
      </div>

      {/* Learning Path Steps - Ordered List */}
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            📚 Learning Journey - Step by Step
          </h3>
          <p className="text-slate-300 text-lg">Follow your personalized learning path to master JavaScript</p>
        </div>
        
        {learningPath?.modules?.map((module, moduleIndex) => (
          <div key={module.id} className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            {/* Module Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold mr-6 shadow-lg ${
                  module.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  module.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                  'bg-gradient-to-r from-gray-500 to-slate-500'
                }`}>
                  <span className="text-2xl">{moduleIndex + 1}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{module.title}</h4>
                  <p className="text-slate-300 text-lg">{module.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                  module.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                  module.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                  'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                }`}>
                  {module.status}
                </span>
                {module.status !== 'Not Started' && (
                  <div className="text-lg text-slate-300 mt-2 font-semibold">{module.progress}% Complete</div>
                )}
              </div>
            </div>

            {/* Module Progress Bar */}
            {module.status !== 'Not Started' && (
              <div className="mb-6">
                <div className="w-full bg-slate-700 rounded-full h-4 shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 shadow-lg ${
                      module.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                      'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Lessons List */}
            <div className="space-y-4">
              <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">📖</span>
                Lessons in this module:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.lessons?.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 backdrop-blur-sm rounded-xl p-6 border border-slate-500/20 hover:border-blue-400/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg ${
                          lesson.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          lesson.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                          'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                        }`}>
                          {moduleIndex + 1}.{lessonIndex + 1}
                        </div>
                        <div>
                          <span className="text-white font-bold text-lg">{lesson.title}</span>
                          <div className="text-slate-400 text-sm mt-1">⏱️ {lesson.duration}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {lesson.score && (
                        <div className="text-green-400 font-bold text-xl bg-green-500/20 px-3 py-1 rounded-lg">
                          {lesson.score}%
                        </div>
                      )}
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                        lesson.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        lesson.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                        'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                      }`}>
                        {lesson.status === 'Completed' ? '✅ Completed' :
                         lesson.status === 'In Progress' ? '🔄 In Progress' :
                         '⏳ Not Started'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Learning Goals */}
        <div className="bg-gradient-to-r from-blue-800/40 to-purple-800/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            Your Learning Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPath?.user?.learningGoals?.map((goal, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-white font-medium text-lg">{goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        {learningPath?.aiRecommendations && learningPath.aiRecommendations.length > 0 && (
          <div className="bg-gradient-to-r from-purple-800/40 via-pink-800/40 to-red-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🤖</span>
              AI Recommendations
            </h3>
            <div className="space-y-6">
              {learningPath.aiRecommendations.map((rec, index) => (
                <div key={index} className={`p-6 rounded-xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                  rec.priority === 'high' ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-400 hover:shadow-red-500/20' :
                  rec.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400 hover:shadow-yellow-500/20' :
                  'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400 hover:shadow-green-500/20'
                }`}>
                  <div className="flex items-start">
                    <span className={`text-3xl mr-4 ${
                      rec.priority === 'high' ? 'text-red-400' :
                      rec.priority === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {rec.type === 'skill_gap' ? '🎯' : '💡'}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg mb-3">{rec.message}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm px-4 py-2 rounded-full font-bold ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {rec.priority} priority
                        </span>
                        <span className="text-sm text-white/60 capitalize">{rec.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Company View - Shows workers with dropdown choice lists
const CompanyView = ({ onBack }) => {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [showCourseSearch, setShowCourseSearch] = useState(false)
  const [showWorkerSearch, setShowWorkerSearch] = useState(false)
  const [courseQuery, setCourseQuery] = useState('')
  const [workerQuery, setWorkerQuery] = useState('')
  const [courseResults, setCourseResults] = useState([])
  const [workerResults, setWorkerResults] = useState([])
  const [courseLoading, setCourseLoading] = useState(false)
  const [workerLoading, setWorkerLoading] = useState(false)
  const [courseError, setCourseError] = useState(null)
  const [workerError, setWorkerError] = useState(null)

  useEffect(() => {
    loadWorkers()
  }, [])

  // Map compact company mock structure into the frontend-compatible workers shape
  const mapCompanyToWorkers = (companyData) => {
    if (!companyData || !Array.isArray(companyData.workers)) return []
    return (companyData.workers || []).map(w => {
      const lp = {
        id: `lp-${w.workerId}`,
        name: `${w.workerName} Learning Path`,
        status: 'in_progress',
        progress: 0,
        startDate: (w.courses && w.courses[0] && w.courses[0].learningPaths && w.courses[0].learningPaths[0]) ? w.courses[0].learningPaths[0].generatedAt : null,
        estimatedCompletion: null,
        courses: (w.courses || []).map(c => ({
          id: c.id,
          title: c.name,
          status: c.learningPaths && c.learningPaths[0] && c.learningPaths[0].expanded ? 'In Progress' : 'Not Started',
          score: null,
          completedDate: null,
          duration: '10 hours'
        }))
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 p-4 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 rounded-2xl text-white transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 border border-emerald-400/30 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">←</span>
            <span className="font-bold text-lg">Back</span>
          </div>
        </button>
        <h1 className="text-4xl font-black text-white bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Company Workers</h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Top Right Search Buttons */}
        <div className="flex justify-end mb-8 space-x-4">
          <div className="relative">
            <button
              onClick={() => { setShowCourseSearch(prev => !prev); setShowWorkerSearch(false) }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              search course
            </button>
            {showCourseSearch && (
              <div className="absolute right-0 mt-2 w-96 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 z-20">
                <div className="flex">
                  <input
                    value={courseQuery}
                    onChange={(e) => setCourseQuery(e.target.value)}
                    placeholder="Search courses by title..."
                    className="flex-1 p-2 rounded-l-md bg-slate-800 text-white border border-white/10"
                  />
                  <button
                    onClick={async () => {
                      setCourseLoading(true)
                      setCourseError(null)
                      try {
                        const q = courseQuery.trim()
                        if (!q) return setCourseResults([])

                        // Try remote API first
                        try {
                          const res = await fetch(`${API_BASE}/api/learning-paths/courses/search?q=${encodeURIComponent(q)}`)
                          if (res.ok) {
                            const data = await res.json()
                            const results = Array.isArray(data) ? data : (data.results || [])
                            if (results && results.length > 0) {
                              setCourseResults(results)
                              setCourseLoading(false)
                              return
                            }
                          }
                        } catch (apiErr) {
                          // swallow and fall back to local mock
                          console.warn('Course API search failed, falling back to local mock:', apiErr.message || apiErr)
                        }

                        // Fallback: search the static mock file in public/mock
                        try {
                          const r = await fetch('/mock/company-mock.json')
                          if (r.ok) {
                            const company = await r.json()
                            const out = []
                            ;(company.workers || []).forEach(w => {
                              ;(w.courses || []).forEach(c => {
                                const title = (c.name || '').toLowerCase()
                                if (title.includes(q.toLowerCase())) {
                                  out.push({
                                    courseId: c.id,
                                    id: c.id,
                                    title: c.name,
                                    learningPathTitle: (c.learningPaths && c.learningPaths[0] && c.learningPaths[0].id) || '',
                                    learningPathName: (c.learningPaths && c.learningPaths[0] && c.learningPaths[0].id) || '',
                                    workerName: w.workerName,
                                    workerId: w.workerId
                                  })
                                }
                              })
                            })
                            setCourseResults(out)
                            setCourseLoading(false)
                            return
                          }
                        } catch (mockErr) {
                          console.error('Local course fallback failed:', mockErr)
                        }

                        // nothing found
                        setCourseResults([])
                      } catch (err) {
                        console.error(err)
                        setCourseError(err.message || 'Error')
                      } finally {
                        setCourseLoading(false)
                      }
                    }}
                    className="px-3 bg-emerald-500 rounded-r-md text-white font-semibold"
                  >
                    Go
                  </button>
                </div>
                <div className="mt-3 max-h-48 overflow-auto">
                  {courseLoading && <div className="text-sm text-white/80">Searching...</div>}
                  {courseError && <div className="text-sm text-red-300">{courseError}</div>}
                  {!courseLoading && (
                    <div className="text-sm text-white/60 mb-2">Results: {courseResults.length}</div>
                  )}
                  {!courseLoading && courseResults.length === 0 && <div className="text-sm text-white/60">No results</div>}
                  {courseResults.map((c, idx) => (
                    <React.Fragment key={c.courseId || c.id || JSON.stringify(c)}>
                      <div
                        className={`${idx > 0 ? 'mt-2 pt-2' : ''} p-2 hover:bg-white/5 rounded-md text-white cursor-pointer transition-colors duration-150`}
                        onClick={async () => {
                          console.log('clicked course result', c)
                          // Ensure workers are loaded before selecting
                          if (c.workerId) {
                            try {
                              if (!workers || workers.length === 0) {
                                console.log('workers empty, loading workers before selecting')
                                await loadWorkers()
                              }
                            } catch (e) {
                              console.error('failed to load workers before selecting', e)
                            }

                            setSelectedWorker(c.workerId)
                            // set selectedCourse after a tick to ensure selectedWorker state propagates
                            setTimeout(() => {
                              setSelectedCourse(c.courseId || c.id)
                              console.log('selection applied:', { selectedWorker: c.workerId, selectedCourse: c.courseId || c.id })
                            }, 50)
                          }
                          setShowCourseSearch(false)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm font-semibold text-white">
                              {getInitials(c.workerName)}
                            </div>
                            <div>
                              <div className="font-semibold">{c.title}</div>
                              <div className="text-sm text-white/60">{c.learningPathTitle || c.learningPathName}</div>
                            </div>
                          </div>
                          <div className="text-sm text-white/60 ml-4">{c.workerName}</div>
                        </div>
                      </div>

                      {/* dashed separator for cleaner look */}
                      {idx < courseResults.length - 1 && (
                        <div className="text-sm text-white/40 my-2 select-none">.......................</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowWorkerSearch(prev => !prev); setShowCourseSearch(false) }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              search worker
            </button>
            {showWorkerSearch && (
              <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 z-20">
                <div className="flex">
                  <input
                    value={workerQuery}
                    onChange={(e) => setWorkerQuery(e.target.value)}
                    placeholder="Search workers by name or email..."
                    className="flex-1 p-2 rounded-l-md bg-slate-800 text-white border border-white/10"
                  />
                  <button
                    onClick={async () => {
                      setWorkerLoading(true)
                      setWorkerError(null)
                      try {
                        const q = workerQuery.trim()
                        if (!q) return setWorkerResults([])
                        // Try API first
                        try {
                          const res = await fetch(`${API_BASE}/api/workers/search?q=${encodeURIComponent(q)}`)
                          if (res.ok) {
                            const data = await res.json()
                            const results = data.workers || data || []
                            if (results && results.length > 0) {
                              setWorkerResults(results)
                              setWorkerLoading(false)
                              return
                            }
                          }
                        } catch (apiErr) {
                          console.warn('Worker API search failed, falling back to local mock:', apiErr.message || apiErr)
                        }

                        // Fallback: local mock
                        try {
                          const r = await fetch('/mock/company-mock.json')
                          if (r.ok) {
                            const company = await r.json()
                            const out = (company.workers || []).filter(w => {
                              const name = (w.workerName || '').toLowerCase()
                              const email = (w.email || `${(w.workerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com`).toLowerCase()
                              return name.includes(q.toLowerCase()) || email.includes(q.toLowerCase())
                            }).map(w => ({
                              id: w.workerId,
                              name: w.workerName,
                              email: w.email || `${(w.workerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com`,
                              learningPath: {
                                id: `lp-${w.workerId}`,
                                courses: (w.courses || []).map(c => ({ id: c.id, title: c.name }))
                              }
                            }))
                            setWorkerResults(out)
                            setWorkerLoading(false)
                            return
                          }
                        } catch (mockErr) {
                          console.error('Local worker fallback failed:', mockErr)
                        }

                        setWorkerResults([])
                      } catch (err) {
                        console.error(err)
                        setWorkerError(err.message || 'Error')
                      } finally {
                        setWorkerLoading(false)
                      }
                    }}
                    className="px-3 bg-emerald-500 rounded-r-md text-white font-semibold"
                  >
                    Go
                  </button>
                </div>
                <div className="mt-3 max-h-48 overflow-auto">
                  {workerLoading && <div className="text-sm text-white/80">Searching...</div>}
                  {workerError && <div className="text-sm text-red-300">{workerError}</div>}
                  {!workerLoading && workerResults.length === 0 && <div className="text-sm text-white/60">No results</div>}
                  {workerResults.map((w, idx) => (
                    <React.Fragment key={w.id || w.workerId || JSON.stringify(w)}>
                      <div className="p-2 hover:bg-white/5 rounded-md text-white cursor-pointer transition-colors duration-150" onClick={() => {
                        // Normalize the clicked worker into the legacy shape the UI expects
                        const normalized = {
                          id: w.id || w.workerId,
                          name: w.name || w.workerName,
                          email: w.email || (w.email === undefined ? `${(w.name || w.workerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com` : w.email),
                          learningPath: w.learningPath || {
                            id: (w.learningPath && w.learningPath.id) || `lp-${w.id || w.workerId}`,
                            courses: (w.learningPath && w.learningPath.courses) || (w.courses || []).map(c => ({ id: c.id, title: c.title || c.name }))
                          }
                        }

                        // Ensure the workers list contains this worker so UI helpers (getSelectedWorker) work
                        // If worker exists, merge/replace it so learningPath/courses from the search result are applied
                        setWorkers(prev => {
                          if (!prev || !Array.isArray(prev)) return [normalized]
                          const exists = prev.find(x => x.id === normalized.id)
                          if (!exists) return [...prev, normalized]
                          return prev.map(x => x.id === normalized.id ? { ...x, ...normalized } : x)
                        })

                        setSelectedWorker(normalized.id)
                        setSelectedCourse('')
                        setShowWorkerSearch(false)
                      }}>
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm font-semibold text-white">
                            {getInitials(w.name || w.workerName)}
                          </div>
                          <div>
                            <div className="font-semibold">{w.name || w.workerName}</div>
                            <div className="text-sm text-white/60">{w.email || `${(w.name || w.workerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com`}</div>
                          </div>
                        </div>
                      </div>

                      {/* dashed separator for worker results */}
                      {idx < workerResults.length - 1 && (
                        <div className="text-sm text-white/40 my-2 select-none">.......................</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Workers Section */}
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Workers:</h2>
            <select
              value={selectedWorker}
              onChange={(e) => handleWorkerChange(e.target.value)}
              className="w-full p-4 bg-gradient-to-r from-emerald-700/60 to-teal-700/60 backdrop-blur-sm text-white rounded-xl border border-emerald-400/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-lg font-medium"
            >
              <option value="">select worker</option>
              {workers?.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Side - Courses Section */}
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Courses:</h2>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full p-4 bg-gradient-to-r from-emerald-700/60 to-teal-700/60 backdrop-blur-sm text-white rounded-xl border border-emerald-400/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-lg font-medium"
            >
              <option value="">select course</option>
              {getSelectedWorker()?.learningPath.courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Details - Only show if both worker and course are selected */}
        {selectedWorker && selectedCourse && (
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {getSelectedWorker()?.name} - {getSelectedCourse()?.title}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-700/30 to-teal-700/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/20">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 font-semibold">Learning Path:</span>
                    <span className="text-white">
                      {getSelectedCourse()?.title} Mastery Program - {getSelectedCourse()?.title.toLowerCase()} fundamentals to advanced concepts
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 font-semibold">Progress:</span>
                    <div className="flex items-center">
                      <span className="text-white mr-2">
                        {getSelectedCourse()?.status === 'Completed' ? '100%' :
                         getSelectedCourse()?.status === 'In Progress' ? '65%' : '0%'}
                      </span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            getSelectedCourse()?.status === 'Completed' ? 'bg-green-500' :
                            getSelectedCourse()?.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                          style={{ 
                            width: getSelectedCourse()?.status === 'Completed' ? '100%' :
                                   getSelectedCourse()?.status === 'In Progress' ? '65%' : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 font-semibold">Date of Starting:</span>
                    <span className="text-white">
                      {getSelectedCourse()?.status === 'Completed' ? getSelectedCourse()?.completedDate :
                       getSelectedCourse()?.status === 'In Progress' ? getSelectedWorker()?.learningPath.startDate :
                       'Not Started'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 font-semibold">Duration:</span>
                    <span className="text-white">{getSelectedCourse()?.duration}</span>
                  </div>
                  
                  {getSelectedCourse()?.score && (
                    <div className="flex items-center">
                      <span className="text-slate-400 w-32 font-semibold">Score:</span>
                      <span className="text-green-400 font-semibold">{getSelectedCourse()?.score}%</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 font-semibold">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getSelectedCourse()?.status === 'Completed' ? 'bg-green-500 text-white' :
                      getSelectedCourse()?.status === 'In Progress' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {getSelectedCourse()?.status === 'Completed' ? '✅ Completed' :
                       getSelectedCourse()?.status === 'In Progress' ? '🔄 In Progress' :
                       '⏳ Not Started'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage