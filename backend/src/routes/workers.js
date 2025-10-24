import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'
import { validateWorker, validateSkillGaps } from '../utils/validation.js'

const router = express.Router()

// Search workers and courses. Query param: q
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim()
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' })

    // Search workers by name or email
    const { data: workers, error: workersError } = await supabase
      .from('workers')
      .select(`id,name,email,department,position,overall_progress,completed_courses`)
      .or(`name.ilike.%${q}%,email.ilike.%${q}%`)

    if (workersError) {
      logger.error('Error searching workers:', workersError)
      return res.status(500).json({ error: 'Failed to search workers' })
    }

    // Search courses by title inside learning paths. Some PostgREST setups don't
    // allow filtering on nested arrays directly, so fetch paths with courses and
    // filter in JS.
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select(`id,title,worker_id,courses(id,title)`) // courses is a related table

    if (pathsError) {
      logger.error('Error fetching learning paths for course search:', pathsError)
      return res.status(500).json({ error: 'Failed to search courses' })
    }

    const qLower = q.toLowerCase()
    const matchedCourses = []
    ;(paths || []).forEach(p => {
      (p.courses || []).forEach(c => {
        if (c.title && c.title.toLowerCase().includes(qLower)) {
          matchedCourses.push({
            courseId: c.id,
            title: c.title,
            learningPathId: p.id,
            learningPathTitle: p.title,
            workerId: p.worker_id
          })
        }
      })
    })

    res.json({ workers: workers || [], courses: matchedCourses })
  } catch (error) {
    next(error)
  }
})

// Get all workers with their progress
router.get('/', async (req, res, next) => {
  try {
    const { data: workers, error } = await supabase
      .from('workers')
      .select(`
        *,
        learning_paths (
          id,
          title,
          status,
          progress
        ),
        skill_gaps (
          id,
          skill_name,
          status,
          priority
        )
      `)

    if (error) {
      logger.error('Error fetching workers:', error)
      return res.status(500).json({ error: 'Failed to fetch workers' })
    }

    // Transform data for frontend
    const transformedWorkers = workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      department: worker.department,
      position: worker.position,
      progress: worker.overall_progress || 0,
      completedCourses: worker.completed_courses || 0,
      activeLearningPaths: worker.learning_paths?.filter(lp => lp.status === 'active').length || 0,
      status: worker.status || 'active',
      skillGaps: worker.skill_gaps || [],
      recentActivity: worker.recent_activity || []
    }))

    res.json(transformedWorkers)
  } catch (error) {
    next(error)
  }
})

// Get worker details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: worker, error } = await supabase
      .from('workers')
      .select(`
        *,
        learning_paths (
          *,
          courses (
            *
          )
        ),
        skill_gaps (
          *
        ),
        assessments (
          *
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Error fetching worker:', error)
      return res.status(404).json({ error: 'Worker not found' })
    }

    res.json(worker)
  } catch (error) {
    next(error)
  }
})

// Get worker progress
router.get('/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: progress, error } = await supabase
      .from('worker_progress')
      .select('*')
      .eq('worker_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching worker progress:', error)
      return res.status(500).json({ error: 'Failed to fetch progress' })
    }

    res.json(progress)
  } catch (error) {
    next(error)
  }
})

// Get worker learning path
router.get('/:id/learning-path', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        courses (
          *
        )
      `)
      .eq('worker_id', id)
      .eq('status', 'active')
      .single()

    if (error) {
      logger.error('Error fetching learning path:', error)
      return res.status(404).json({ error: 'No active learning path found' })
    }

    res.json(learningPath)
  } catch (error) {
    next(error)
  }
})

// Update worker skill gaps
router.post('/:id/skill-gaps', async (req, res, next) => {
  try {
    const { id } = req.params
    const { skillGaps } = req.body

    // Validate input
    const { error: validationError } = validateSkillGaps(skillGaps)
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message })
    }

    // Delete existing skill gaps
    await supabase
      .from('skill_gaps')
      .delete()
      .eq('worker_id', id)

    // Insert new skill gaps
    const skillGapsWithWorkerId = skillGaps.map(skill => ({
      ...skill,
      worker_id: id
    }))

    const { data, error } = await supabase
      .from('skill_gaps')
      .insert(skillGapsWithWorkerId)

    if (error) {
      logger.error('Error updating skill gaps:', error)
      return res.status(500).json({ error: 'Failed to update skill gaps' })
    }

    // Log the update
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: id,
        action: 'skill_gaps_updated',
        data: skillGaps,
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Update worker progress after assessment
router.post('/:id/assessment-result', async (req, res, next) => {
  try {
    const { id } = req.params
    const { courseId, score, passed, attemptNumber } = req.body

    // Record assessment result
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        worker_id: id,
        course_id: courseId,
        score,
        passed,
        attempt_number: attemptNumber,
        completed_at: new Date().toISOString()
      })

    if (assessmentError) {
      logger.error('Error recording assessment:', assessmentError)
      return res.status(500).json({ error: 'Failed to record assessment' })
    }

    // Update worker progress
    const { error: progressError } = await supabase
      .from('workers')
      .update({
        last_assessment_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (progressError) {
      logger.error('Error updating worker progress:', progressError)
    }

    // Trigger skill gap analysis if failed
    if (!passed) {
      // This would typically trigger an AI service call
      logger.info(`Worker ${id} failed assessment for course ${courseId}, triggering skill gap analysis`)
    }

    // Send update to HR and Learning Analytics
    // This would typically be an async operation
    logger.info(`Sending assessment update to external systems for worker ${id}`)

    res.json({ success: true, assessment })
  } catch (error) {
    next(error)
  }
})

export default router
