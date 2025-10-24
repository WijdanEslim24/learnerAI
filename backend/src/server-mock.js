import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from './utils/logger.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/auth-mock.js'
import workerRoutes from './routes/workers-mock.js'
import learningPathRoutes from './routes/learningPaths-mock.js'
import skillGapRoutes from './routes/skillGaps-mock.js'
import analyticsRoutes from './routes/analytics-mock.js'
import aiRoutes from './routes/ai-mock.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

// Load mock data
const learnerMockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'learner-mock.json'), 'utf8'))
const companyMockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'company-mock.json'), 'utf8'))

// Make mock data available globally
global.mockData = {
  learner: learnerMockData,
  company: companyMockData
}

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Security Middleware
app.use(helmet())
// Allow common frontend dev origins (Vite, CRA, etc.) for the mock server
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'http://localhost:3013',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}))
app.use(express.json())
app.use(compression())
app.use(morgan('combined'))

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
app.use(limiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: 'mock'
  })
})

// User type detection endpoint
app.get('/api/user-type', (req, res) => {
  // For demo purposes, you can switch between user types
  // In a real app, this would be determined by authentication
  const userType = req.query.type || 'learner' // Default to learner
  
  if (userType === 'company') {
    res.json({
      userType: 'company',
      data: companyMockData
    })
  } else {
    res.json({
      userType: 'learner', 
      data: learnerMockData
    })
  }
})

// API Routes (using mock data)
app.use('/api/auth', authRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/learning-paths', learningPathRoutes)
app.use('/api/skill-gaps', skillGapRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/ai', aiRoutes)

// Error handling middleware
app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
  logger.info(`Mock Backend Server running on port ${PORT}`)
  logger.info(`Frontend URL: ${FRONTEND_URL}`)
  logger.info(`Available user types: learner, company`)
  logger.info(`Test endpoints:`)
  logger.info(`  GET /api/user-type?type=learner`)
  logger.info(`  GET /api/user-type?type=company`)
})