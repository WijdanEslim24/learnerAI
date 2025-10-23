import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'

const router = express.Router()

// Generate learning path using AI
router.post('/generate-learning-path', async (req, res, next) => {
  try {
    const { workerId, skillGaps } = req.body

    if (!workerId || !skillGaps || !Array.isArray(skillGaps)) {
      return res.status(400).json({ error: 'Worker ID and skill gaps are required' })
    }

    logger.info(`Generating learning path for worker ${workerId} with ${skillGaps.length} skill gaps`)

    // This would typically call an external AI service
    // For now, we'll simulate the AI generation
    const mockLearningPath = {
      title: `Personalized Learning Path for ${skillGaps[0]?.skill_name || 'Skills'}`,
      description: 'AI-generated learning path based on identified skill gaps',
      difficulty: 'intermediate',
      estimated_hours: skillGaps.length * 8,
      status: 'draft',
      worker_id: workerId,
      created_at: new Date().toISOString()
    }

    // Create learning path in database
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .insert(mockLearningPath)
      .select()
      .single()

    if (pathError) {
      logger.error('Error creating learning path:', pathError)
      return res.status(500).json({ error: 'Failed to create learning path' })
    }

    // Generate courses for each skill gap
    const courses = skillGaps.map((skill, index) => ({
      title: `${skill.skill_name} Course`,
      description: `Comprehensive course covering ${skill.skill_name}`,
      duration: '2 hours',
      difficulty: skill.gap_level || 'intermediate',
      learning_path_id: learningPath.id,
      order_index: index
    }))

    const { data: createdCourses, error: courseError } = await supabase
      .from('courses')
      .insert(courses)
      .select()

    if (courseError) {
      logger.error('Error creating courses:', courseError)
    }

    // Log AI recommendation
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        learning_path_id: learningPath.id,
        action: 'learning_path_generated',
        data: { skillGaps, courses: createdCourses },
        timestamp: new Date().toISOString()
      })

    res.json({
      success: true,
      learningPath: {
        ...learningPath,
        courses: createdCourses || []
      }
    })
  } catch (error) {
    next(error)
  }
})

// Expand learning materials using AI
router.post('/expand-materials', async (req, res, next) => {
  try {
    const { courseId, context } = req.body

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' })
    }

    logger.info(`Expanding learning materials for course ${courseId}`)

    // This would typically call an external AI service
    // For now, we'll simulate the AI expansion
    const expandedMaterials = {
      additionalResources: [
        'Interactive coding exercises',
        'Video tutorials',
        'Practice projects',
        'Reference documentation'
      ],
      personalizedContent: [
        'Custom examples based on your role',
        'Industry-specific case studies',
        'Advanced topics for your skill level'
      ],
      assessmentQuestions: [
        'Multiple choice questions',
        'Practical coding challenges',
        'Scenario-based problems'
      ]
    }

    // Update course with expanded materials
    const { data: updatedCourse, error } = await supabase
      .from('courses')
      .update({
        expanded_materials: expandedMaterials,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating course with expanded materials:', error)
      return res.status(500).json({ error: 'Failed to expand materials' })
    }

    // Log AI expansion
    await supabase
      .from('ai_recommendations_log')
      .insert({
        course_id: courseId,
        action: 'materials_expanded',
        data: expandedMaterials,
        timestamp: new Date().toISOString()
      })

    res.json({
      success: true,
      expandedMaterials,
      course: updatedCourse
    })
  } catch (error) {
    next(error)
  }
})

// Get AI recommendations log
router.get('/recommendations-log', async (req, res, next) => {
  try {
    const { workerId, limit = 50 } = req.query

    let query = supabase
      .from('ai_recommendations_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit))

    if (workerId) {
      query = query.eq('worker_id', workerId)
    }

    const { data: logs, error } = await query

    if (error) {
      logger.error('Error fetching AI recommendations log:', error)
      return res.status(500).json({ error: 'Failed to fetch recommendations log' })
    }

    res.json(logs)
  } catch (error) {
    next(error)
  }
})

// Trigger skill gap analysis
router.post('/analyze-skill-gaps', async (req, res, next) => {
  try {
    const { workerId, assessmentData } = req.body

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' })
    }

    logger.info(`Triggering AI skill gap analysis for worker ${workerId}`)

    // This would typically call an external Skills Engine API
    // For now, we'll simulate the analysis
    const mockAnalysis = {
      skillGaps: [
        {
          skill_name: 'Advanced JavaScript',
          priority: 'high',
          gap_level: 'intermediate',
          confidence: 0.85
        },
        {
          skill_name: 'React Hooks',
          priority: 'medium',
          gap_level: 'beginner',
          confidence: 0.72
        }
      ],
      recommendations: [
        'Focus on ES6+ features and async programming',
        'Practice with React functional components',
        'Build projects using modern JavaScript patterns'
      ],
      estimatedTimeToClose: '4-6 weeks'
    }

    // Store analysis results
    const skillGapsWithWorkerId = mockAnalysis.skillGaps.map(skill => ({
      ...skill,
      worker_id: workerId,
      created_at: new Date().toISOString()
    }))

    const { data: storedGaps, error: gapsError } = await supabase
      .from('skill_gaps')
      .insert(skillGapsWithWorkerId)
      .select()

    if (gapsError) {
      logger.error('Error storing skill gaps:', gapsError)
    }

    // Log the analysis
    await supabase
      .from('ai_recommendations_log')
      .insert({
        worker_id: workerId,
        action: 'skill_gap_analysis_completed',
        data: mockAnalysis,
        timestamp: new Date().toISOString()
      })

    res.json({
      success: true,
      analysis: mockAnalysis,
      skillGaps: storedGaps
    })
  } catch (error) {
    next(error)
  }
})

// Get AI model performance metrics
router.get('/model-performance', async (req, res, next) => {
  try {
    const { timeRange = '30d' } = req.query

    // Calculate date range
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get AI recommendations and their outcomes
    const { data: recommendations, error } = await supabase
      .from('ai_recommendations_log')
      .select('*')
      .gte('timestamp', startDate.toISOString())

    if (error) {
      logger.error('Error fetching AI recommendations:', error)
      return res.status(500).json({ error: 'Failed to fetch AI performance data' })
    }

    // Calculate performance metrics
    const totalRecommendations = recommendations.length
    const learningPathRecommendations = recommendations.filter(r => r.action === 'learning_path_generated').length
    const materialExpansions = recommendations.filter(r => r.action === 'materials_expanded').length
    const skillGapAnalyses = recommendations.filter(r => r.action === 'skill_gap_analysis_completed').length

    // Calculate success rates (this would need more complex logic in a real implementation)
    const successfulRecommendations = recommendations.filter(r => 
      r.action === 'learning_path_completed' || 
      r.action === 'skill_gap_completed'
    ).length

    const successRate = totalRecommendations > 0 ? 
      (successfulRecommendations / totalRecommendations) * 100 : 0

    res.json({
      totalRecommendations,
      learningPathRecommendations,
      materialExpansions,
      skillGapAnalyses,
      successRate: Math.round(successRate),
      recommendationsByDay: recommendations.reduce((acc, rec) => {
        const date = rec.timestamp.split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})
    })
  } catch (error) {
    next(error)
  }
})

export default router
