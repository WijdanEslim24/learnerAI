import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Workers API
export const getWorkers = async () => {
  try {
    const response = await api.get('/api/workers')
    return response.data
  } catch (error) {
    console.error('Error fetching workers:', error)
    throw error
  }
}

export const getWorkerDetails = async (workerId) => {
  try {
    const response = await api.get(`/api/workers/${workerId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching worker details:', error)
    throw error
  }
}

export const getWorkerProgress = async (workerId) => {
  try {
    const response = await api.get(`/api/workers/${workerId}/progress`)
    return response.data
  } catch (error) {
    console.error('Error fetching worker progress:', error)
    throw error
  }
}

export const getWorkerLearningPath = async (workerId) => {
  try {
    const response = await api.get(`/api/workers/${workerId}/learning-path`)
    return response.data
  } catch (error) {
    console.error('Error fetching learning path:', error)
    throw error
  }
}

// Learning Paths API
export const getLearningPaths = async () => {
  try {
    const response = await api.get('/api/learning-paths')
    return response.data
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    throw error
  }
}

export const createLearningPath = async (pathData) => {
  try {
    const response = await api.post('/api/learning-paths', pathData)
    return response.data
  } catch (error) {
    console.error('Error creating learning path:', error)
    throw error
  }
}

export const updateLearningPath = async (pathId, pathData) => {
  try {
    const response = await api.put(`/api/learning-paths/${pathId}`, pathData)
    return response.data
  } catch (error) {
    console.error('Error updating learning path:', error)
    throw error
  }
}

// Skill Gap Analysis API
export const getSkillGaps = async (workerId) => {
  try {
    const response = await api.get(`/api/skill-gaps/${workerId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching skill gaps:', error)
    throw error
  }
}

export const updateSkillGaps = async (workerId, skillGaps) => {
  try {
    const response = await api.post(`/api/skill-gaps/${workerId}`, skillGaps)
    return response.data
  } catch (error) {
    console.error('Error updating skill gaps:', error)
    throw error
  }
}

// Analytics API
export const getAnalytics = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}

export const getProgressMetrics = async () => {
  try {
    const response = await api.get('/api/analytics/progress')
    return response.data
  } catch (error) {
    console.error('Error fetching progress metrics:', error)
    throw error
  }
}

// AI Integration API
export const generateLearningPath = async (workerId, skillGaps) => {
  try {
    const response = await api.post('/api/ai/generate-learning-path', {
      workerId,
      skillGaps
    })
    return response.data
  } catch (error) {
    console.error('Error generating learning path:', error)
    throw error
  }
}

export const expandLearningMaterials = async (courseId, context) => {
  try {
    const response = await api.post('/api/ai/expand-materials', {
      courseId,
      context
    })
    return response.data
  } catch (error) {
    console.error('Error expanding learning materials:', error)
    throw error
  }
}

// User Type Management
export const getUserType = async (type = 'learner') => {
  try {
    const response = await api.get(`/api/user-type?type=${type}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user type:', error)
    throw error
  }
}

// Learner-specific APIs
export const getLearnerProfile = async () => {
  try {
    const response = await api.get('/api/workers/learner/profile')
    return response.data
  } catch (error) {
    console.error('Error fetching learner profile:', error)
    throw error
  }
}

export const getMyLearningPath = async () => {
  try {
    const response = await api.get('/api/learning-paths/learner/my-path')
    return response.data
  } catch (error) {
    console.error('Error fetching my learning path:', error)
    throw error
  }
}

export const getMySkillGaps = async () => {
  try {
    const response = await api.get('/api/skill-gaps/learner/my-gaps')
    return response.data
  } catch (error) {
    console.error('Error fetching my skill gaps:', error)
    throw error
  }
}

export const getMyProgress = async () => {
  try {
    const response = await api.get('/api/analytics/learner/progress')
    return response.data
  } catch (error) {
    console.error('Error fetching my progress:', error)
    throw error
  }
}

export const getAIRecommendations = async () => {
  try {
    const response = await api.get('/api/ai/learner/recommendations')
    return response.data
  } catch (error) {
    console.error('Error fetching AI recommendations:', error)
    throw error
  }
}

export default api
