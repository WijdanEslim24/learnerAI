import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'

const router = express.Router()

// Simple auth routes for demo purposes
// In production, you'd want proper JWT authentication

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // For demo purposes, we'll use a simple check
    // In production, you'd verify against Supabase Auth
    if (email === 'admin@learnerai.com' && password === 'admin123') {
      const token = 'demo-token-' + Date.now()
      
      res.json({
        success: true,
        token,
        user: {
          id: 'admin-1',
          email,
          name: 'Admin User',
          role: 'admin'
        }
      })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    next(error)
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

// Get current user
router.get('/me', (req, res) => {
  // In production, you'd verify the JWT token
  res.json({
    id: 'admin-1',
    email: 'admin@learnerai.com',
    name: 'Admin User',
    role: 'admin'
  })
})

export default router
