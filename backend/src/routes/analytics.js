import express from 'express'
import { supabase } from '../server.js'
import logger from '../utils/logger.js'

const router = express.Router()

// Get analytics data
router.get('/', async (req, res, next) => {
  try {
    const { timeRange = '30d' } = req.query

    // Calculate date range
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get basic metrics
    const [
      { data: workers, error: workersError },
      { data: learningPaths, error: pathsError },
      { data: assessments, error: assessmentsError }
    ] = await Promise.all([
      supabase.from('workers').select('*'),
      supabase.from('learning_paths').select('*'),
      supabase.from('assessments').select('*').gte('completed_at', startDate.toISOString())
    ])

    if (workersError || pathsError || assessmentsError) {
      logger.error('Error fetching analytics data:', { workersError, pathsError, assessmentsError })
      return res.status(500).json({ error: 'Failed to fetch analytics data' })
    }

    // Calculate metrics
    const activeLearners = workers.filter(w => w.status === 'active').length
    const coursesCompleted = assessments.filter(a => a.passed).length
    const avgProgress = workers.reduce((sum, w) => sum + (w.overall_progress || 0), 0) / workers.length
    const activePaths = learningPaths.filter(lp => lp.status === 'active').length

    // Department distribution
    const departmentCounts = workers.reduce((acc, worker) => {
      acc[worker.department] = (acc[worker.department] || 0) + 1
      return acc
    }, {})

    const departmentDistribution = Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value
    }))

    // Completion by department
    const completionByDepartment = Object.keys(departmentCounts).map(dept => {
      const deptWorkers = workers.filter(w => w.department === dept)
      const completed = assessments.filter(a => 
        a.passed && deptWorkers.some(w => w.id === a.worker_id)
      ).length
      const inProgress = assessments.filter(a => 
        !a.passed && deptWorkers.some(w => w.id === a.worker_id)
      ).length

      return {
        department: dept,
        completed,
        inProgress
      }
    })

    // Top performing learning paths
    const topPaths = learningPaths.map(path => {
      const pathAssessments = assessments.filter(a => a.learning_path_id === path.id)
      const completed = pathAssessments.filter(a => a.passed).length
      const total = pathAssessments.length
      const completionRate = total > 0 ? (completed / total) * 100 : 0
      const successRate = total > 0 ? (completed / total) * 100 : 0

      return {
        id: path.id,
        title: path.title,
        assignedWorkers: path.worker_id ? 1 : 0,
        completionRate: Math.round(completionRate),
        avgCompletionTime: path.estimated_hours || 0,
        successRate: Math.round(successRate)
      }
    }).sort((a, b) => b.completionRate - a.completionRate).slice(0, 10)

    res.json({
      activeLearners,
      coursesCompleted,
      avgProgress: Math.round(avgProgress),
      activePaths,
      departmentDistribution,
      completionByDepartment,
      topPaths
    })
  } catch (error) {
    next(error)
  }
})

// Get progress metrics over time
router.get('/progress', async (req, res, next) => {
  try {
    const { timeRange = '30d' } = req.query

    // Calculate date range
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get progress data over time
    const { data: progressData, error } = await supabase
      .from('worker_progress')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching progress data:', error)
      return res.status(500).json({ error: 'Failed to fetch progress data' })
    }

    // Group by date and calculate averages
    const progressByDate = {}
    progressData.forEach(record => {
      const date = record.created_at.split('T')[0]
      if (!progressByDate[date]) {
        progressByDate[date] = { totalProgress: 0, count: 0, completedCourses: 0 }
      }
      progressByDate[date].totalProgress += record.progress || 0
      progressByDate[date].count += 1
      progressByDate[date].completedCourses += record.completed_courses || 0
    })

    const progressOverTime = Object.entries(progressByDate).map(([date, data]) => ({
      date,
      avgProgress: Math.round(data.totalProgress / data.count),
      completedCourses: data.completedCourses
    }))

    res.json({ progressOverTime })
  } catch (error) {
    next(error)
  }
})

// Get worker performance metrics
router.get('/worker-performance', async (req, res, next) => {
  try {
    const { workerId, timeRange = '30d' } = req.query

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' })
    }

    // Calculate date range
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get worker's assessments
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('worker_id', workerId)
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: true })

    if (error) {
      logger.error('Error fetching worker assessments:', error)
      return res.status(500).json({ error: 'Failed to fetch worker assessments' })
    }

    // Calculate performance metrics
    const totalAssessments = assessments.length
    const passedAssessments = assessments.filter(a => a.passed).length
    const successRate = totalAssessments > 0 ? (passedAssessments / totalAssessments) * 100 : 0
    const avgScore = assessments.length > 0 ? 
      assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length : 0

    // Group by course
    const coursePerformance = {}
    assessments.forEach(assessment => {
      if (!coursePerformance[assessment.course_id]) {
        coursePerformance[assessment.course_id] = {
          attempts: 0,
          passed: 0,
          scores: []
        }
      }
      coursePerformance[assessment.course_id].attempts += 1
      if (assessment.passed) {
        coursePerformance[assessment.course_id].passed += 1
      }
      coursePerformance[assessment.course_id].scores.push(assessment.score)
    })

    const courseMetrics = Object.entries(coursePerformance).map(([courseId, data]) => ({
      courseId,
      attempts: data.attempts,
      passed: data.passed,
      successRate: (data.passed / data.attempts) * 100,
      avgScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
    }))

    res.json({
      totalAssessments,
      passedAssessments,
      successRate: Math.round(successRate),
      avgScore: Math.round(avgScore),
      courseMetrics
    })
  } catch (error) {
    next(error)
  }
})

export default router
