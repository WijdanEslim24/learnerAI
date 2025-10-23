import Joi from 'joi'

// Worker validation schema
export const validateWorker = (worker) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    department: Joi.string().min(2).max(50).required(),
    position: Joi.string().min(2).max(100).required(),
    status: Joi.string().valid('active', 'inactive', 'pending').default('active')
  })

  return schema.validate(worker)
}

// Skill gaps validation schema
export const validateSkillGaps = (skillGaps) => {
  const skillGapSchema = Joi.object({
    skill_name: Joi.string().min(2).max(100).required(),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'failed').default('pending'),
    gap_level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    confidence: Joi.number().min(0).max(1).optional()
  })

  const schema = Joi.array().items(skillGapSchema).min(1)

  return schema.validate(skillGaps)
}

// Learning path validation schema
export const validateLearningPath = (learningPath) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    estimated_hours: Joi.number().min(1).max(1000).required(),
    status: Joi.string().valid('draft', 'active', 'completed', 'archived').default('draft')
  })

  return schema.validate(learningPath)
}

// Course validation schema
export const validateCourse = (course) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    duration: Joi.string().min(1).max(50).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    content: Joi.string().optional(),
    learning_objectives: Joi.array().items(Joi.string()).optional()
  })

  return schema.validate(course)
}

// Assessment validation schema
export const validateAssessment = (assessment) => {
  const schema = Joi.object({
    worker_id: Joi.string().uuid().required(),
    course_id: Joi.string().uuid().required(),
    score: Joi.number().min(0).max(100).required(),
    passed: Joi.boolean().required(),
    attempt_number: Joi.number().min(1).max(10).required(),
    answers: Joi.array().optional(),
    time_spent: Joi.number().min(0).optional()
  })

  return schema.validate(assessment)
}
