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

// Workers API (for company view)
export const getWorkers = async () => {
  try {
    const response = await api.get('/api/workers')
    return response.data
  } catch (error) {
    console.error('Error fetching workers:', error)
    throw error
  }
}

// Learning Paths API (for learner view)
export const getLearningPaths = async (pathId) => {
  try {
    const url = pathId ? `/api/learning-paths/${pathId}` : '/api/learning-paths';
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching learning paths:', error)
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
    const response = await api.get('/api/learner/profile')
    return response.data
  } catch (error) {
    console.error('Error fetching learner profile:', error)
    throw error
  }
}

export const getMyLearningPath = async () => {
  try {
    const response = await api.get('/api/learner/my-learning-path')
    return response.data
  } catch (error) {
    console.error('Error fetching my learning path:', error)
    throw error
  }
}

export const getMySkillGaps = async () => {
  try {
    const response = await api.get('/api/learner/my-skill-gaps')
    return response.data
  } catch (error) {
    console.error('Error fetching my skill gaps:', error)
    throw error
  }
}

export const getMyProgress = async () => {
  try {
    const response = await api.get('/api/learner/progress')
    return response.data
  } catch (error) {
    console.error('Error fetching my progress:', error)
    throw error
  }
}

export const getAIRecommendations = async () => {
  try {
    const response = await api.get('/api/learner/ai-recommendations')
    return response.data
  } catch (error) {
    console.error('Error fetching AI recommendations:', error)
    throw error
  }
}

export default api