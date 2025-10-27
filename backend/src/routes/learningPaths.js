import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Get learner's personal learning path (mock data endpoint)
router.get('/learner/my-path', async (req, res, next) => {
  try {
    // Read the mock data file
    const mockDataPath = path.join(__dirname, '../data/learner-mock.json')
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'))
    
    logger.info('Serving learner mock data')
    res.json(mockData.learningPath)
  } catch (error) {
    logger.error('Error serving learner mock data:', error)
    next(error)
  }
})

// Search courses across learning paths. Query param: q
router.get('/courses/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim()
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' })

    // Fetch learning paths with courses and worker info, then filter courses
    const { data: paths, error } = await supabase
      .from('learning_paths')
      .select(`
        id,
        title,
        worker_id,
        courses (
          id,
          title,
          duration,
          difficulty
        ),
        workers (
          id,
          name
        )
      `)

    if (error) {
      logger.error('Error fetching learning paths for course search:', error)
      return res.status(500).json({ error: 'Failed to search courses' })
    }

    const qLower = q.toLowerCase()
    const results = []
    ;(paths || []).forEach(p => {
      (p.courses || []).forEach(c => {
        if (c.title && c.title.toLowerCase().includes(qLower)) {
          results.push({
            courseId: c.id,
            title: c.title,
            duration: c.duration,
            difficulty: c.difficulty,
            learningPathId: p.id,
            learningPathTitle: p.title,
            worker: p.workers && p.workers.length ? p.workers[0] : undefined
          })
        }
      })
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
})

// Get all learning paths
router.get('/', async (req, res, next) => {
  try {
    const { data: learningPaths, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        courses (
          id,
          title,
          duration,
          difficulty
        ),
        workers (
          id,
          name
        )
      `)

    if (error) {
      logger.error('Error fetching learning paths:', error)
      return res.status(500).json({ error: 'Failed to fetch learning paths' })
    }

    // Transform data for frontend
    const transformedPaths = learningPaths.map(path => ({
      id: path.id,
      title: path.title,
      description: path.description,
      status: path.status,
      courseCount: path.courses?.length || 0,
      estimatedHours: path.estimated_hours || 0,
      difficulty: path.difficulty,
      assignedWorkers: path.workers?.length || 0,
      completionRate: path.completion_rate || 0,
      createdAt: path.created_at,
      updatedAt: path.updated_at
    }))

    res.json(transformedPaths)
  } catch (error) {
    next(error)
  }
})

// Get learning path by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        courses (
          *
        ),
        workers (
          id,
          name,
          email,
          department
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Error fetching learning path:', error)
      return res.status(404).json({ error: 'Learning path not found' })
    }

    res.json(learningPath)
  } catch (error) {
    next(error)
  }
})

// Create new learning path
router.post('/', async (req, res, next) => {
  try {
    const { title, description, courses, difficulty, estimatedHours } = req.body

    // Create learning path
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .insert({
        title,
        description,
        difficulty,
        estimated_hours: estimatedHours,
        status: 'draft',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (pathError) {
      logger.error('Error creating learning path:', pathError)
      return res.status(500).json({ error: 'Failed to create learning path' })
    }

    // Add courses to learning path
    if (courses && courses.length > 0) {
      const courseInserts = courses.map(courseId => ({
        learning_path_id: learningPath.id,
        course_id: courseId,
        order_index: courses.indexOf(courseId)
      }))

      const { error: courseError } = await supabase
        .from('learning_path_courses')
        .insert(courseInserts)

      if (courseError) {
        logger.error('Error adding courses to learning path:', courseError)
      }
    }

    res.status(201).json(learningPath)
  } catch (error) {
    next(error)
  }
})

// Update learning path
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Error updating learning path:', error)
      return res.status(500).json({ error: 'Failed to update learning path' })
    }

    res.json(learningPath)
  } catch (error) {
    next(error)
  }
})

// Assign learning path to worker
router.post('/:id/assign', async (req, res, next) => {
  try {
    const { id } = req.params
    const { workerId } = req.body

    // Check if worker already has an active learning path
    const { data: existingPath, error: checkError } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('worker_id', workerId)
      .eq('status', 'active')
      .single()

    if (existingPath) {
      return res.status(400).json({ error: 'Worker already has an active learning path' })
    }

    // Assign learning path to worker
    const { data, error } = await supabase
      .from('learning_paths')
      .update({
        worker_id: workerId,
        status: 'active',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      logger.error('Error assigning learning path:', error)
      return res.status(500).json({ error: 'Failed to assign learning path' })
    }

    // Log the assignment
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        learning_path_id: id,
        action: 'learning_path_assigned',
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Complete learning path
router.post('/:id/complete', async (req, res, next) => {
  try {
    const { id } = req.params
    const { workerId, finalScore } = req.body

    // Update learning path status
    const { data, error } = await supabase
      .from('learning_paths')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        final_score: finalScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('worker_id', workerId)
      .select()

    if (error) {
      logger.error('Error completing learning path:', error)
      return res.status(500).json({ error: 'Failed to complete learning path' })
    }

    // Update worker progress
    await supabase
      .from('workers')
      .update({
        completed_courses: supabase.raw('completed_courses + 1'),
        overall_progress: supabase.raw('overall_progress + 10'),
        updated_at: new Date().toISOString()
      })
      .eq('id', workerId)

    // Log completion
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        learning_path_id: id,
        action: 'learning_path_completed',
        data: { finalScore },
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

export default router
