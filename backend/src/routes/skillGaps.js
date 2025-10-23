import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'

const router = express.Router()

// Get skill gaps for a worker
router.get('/:workerId', async (req, res, next) => {
  try {
    const { workerId } = req.params

    const { data: skillGaps, error } = await supabase
      .from('skill_gaps')
      .select('*')
      .eq('worker_id', workerId)
      .order('priority', { ascending: true })

    if (error) {
      logger.error('Error fetching skill gaps:', error)
      return res.status(500).json({ error: 'Failed to fetch skill gaps' })
    }

    res.json(skillGaps)
  } catch (error) {
    next(error)
  }
})

// Update skill gaps for a worker
router.post('/:workerId', async (req, res, next) => {
  try {
    const { workerId } = req.params
    const { skillGaps } = req.body

    // Delete existing skill gaps
    const { error: deleteError } = await supabase
      .from('skill_gaps')
      .delete()
      .eq('worker_id', workerId)

    if (deleteError) {
      logger.error('Error deleting existing skill gaps:', deleteError)
      return res.status(500).json({ error: 'Failed to update skill gaps' })
    }

    // Insert new skill gaps
    const skillGapsWithWorkerId = skillGaps.map(skill => ({
      ...skill,
      worker_id: workerId,
      created_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('skill_gaps')
      .insert(skillGapsWithWorkerId)
      .select()

    if (error) {
      logger.error('Error inserting skill gaps:', error)
      return res.status(500).json({ error: 'Failed to update skill gaps' })
    }

    // Log the update
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        action: 'skill_gaps_updated',
        data: skillGaps,
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Mark skill gap as completed
router.put('/:workerId/:skillId/complete', async (req, res, next) => {
  try {
    const { workerId, skillId } = req.params

    const { data, error } = await supabase
      .from('skill_gaps')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', skillId)
      .eq('worker_id', workerId)
      .select()
      .single()

    if (error) {
      logger.error('Error completing skill gap:', error)
      return res.status(500).json({ error: 'Failed to complete skill gap' })
    }

    // Log completion
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        skill_gap_id: skillId,
        action: 'skill_gap_completed',
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// Get skill gap analysis from external Skills Engine
router.post('/:workerId/analyze', async (req, res, next) => {
  try {
    const { workerId } = req.params
    const { assessmentData } = req.body

    // This would typically call an external Skills Engine API
    // For now, we'll simulate the analysis
    logger.info(`Analyzing skill gaps for worker ${workerId}`)

    // Simulate skill gap analysis
    const mockSkillGaps = [
      {
        skill_name: 'JavaScript Fundamentals',
        priority: 'high',
        status: 'pending',
        gap_level: 'intermediate'
      },
      {
        skill_name: 'React Components',
        priority: 'medium',
        status: 'pending',
        gap_level: 'beginner'
      },
      {
        skill_name: 'API Integration',
        priority: 'low',
        status: 'pending',
        gap_level: 'advanced'
      }
    ]

    // Store the analysis results
    const skillGapsWithWorkerId = mockSkillGaps.map(skill => ({
      ...skill,
      worker_id: workerId,
      created_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('skill_gaps')
      .insert(skillGapsWithWorkerId)
      .select()

    if (error) {
      logger.error('Error storing skill gap analysis:', error)
      return res.status(500).json({ error: 'Failed to store skill gap analysis' })
    }

    // Log the analysis
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        action: 'skill_gap_analysis_completed',
        data: { skillGaps: mockSkillGaps },
        timestamp: new Date().toISOString()
      })

    res.json({ success: true, skillGaps: data })
  } catch (error) {
    next(error)
  }
})

export default router
