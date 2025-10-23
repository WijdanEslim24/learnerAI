# LearnerAI API Reference

## Authentication

All API endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-railway-app.railway.app/api`

## Workers API

### Get All Workers
```http
GET /workers
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@company.com",
    "department": "Engineering",
    "position": "Software Developer",
    "progress": 75,
    "completedCourses": 3,
    "activeLearningPaths": 1,
    "status": "active",
    "skillGaps": [...],
    "recentActivity": [...]
  }
]
```

### Get Worker Details
```http
GET /workers/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Smith",
  "email": "john@company.com",
  "department": "Engineering",
  "position": "Software Developer",
  "learning_paths": [...],
  "skill_gaps": [...],
  "assessments": [...]
}
```

### Update Worker Skill Gaps
```http
POST /workers/:id/skill-gaps
Content-Type: application/json

{
  "skillGaps": [
    {
      "skill_name": "React Hooks",
      "priority": "high",
      "status": "pending",
      "gap_level": "intermediate"
    }
  ]
}
```

### Record Assessment Result
```http
POST /workers/:id/assessment-result
Content-Type: application/json

{
  "courseId": "uuid",
  "score": 85,
  "passed": true,
  "attemptNumber": 1
}
```

## Learning Paths API

### Get All Learning Paths
```http
GET /learning-paths
```

### Create Learning Path
```http
POST /learning-paths
Content-Type: application/json

{
  "title": "Frontend Development Path",
  "description": "Complete frontend development curriculum",
  "courses": ["course-id-1", "course-id-2"],
  "difficulty": "intermediate",
  "estimatedHours": 40
}
```

### Assign Learning Path
```http
POST /learning-paths/:id/assign
Content-Type: application/json

{
  "workerId": "uuid"
}
```

## Skill Gaps API

### Get Worker Skill Gaps
```http
GET /skill-gaps/:workerId
```

### Trigger Skill Gap Analysis
```http
POST /skill-gaps/:workerId/analyze
Content-Type: application/json

{
  "assessmentData": {
    "recentAssessments": [...],
    "performanceMetrics": {...}
  }
}
```

## Analytics API

### Get Analytics Data
```http
GET /analytics?timeRange=30d
```

**Query Parameters:**
- `timeRange`: `7d`, `30d`, `90d`, `1y`

**Response:**
```json
{
  "activeLearners": 25,
  "coursesCompleted": 150,
  "avgProgress": 68,
  "activePaths": 12,
  "departmentDistribution": [...],
  "completionByDepartment": [...],
  "topPaths": [...]
}
```

### Get Progress Metrics
```http
GET /analytics/progress?timeRange=30d
```

## AI Integration API

### Generate Learning Path
```http
POST /ai/generate-learning-path
Content-Type: application/json

{
  "workerId": "uuid",
  "skillGaps": [
    {
      "skill_name": "JavaScript",
      "priority": "high",
      "gap_level": "intermediate"
    }
  ]
}
```

### Expand Learning Materials
```http
POST /ai/expand-materials
Content-Type: application/json

{
  "courseId": "uuid",
  "context": {
    "skillLevel": "intermediate",
    "learningStyle": "visual",
    "workerRole": "Frontend Developer"
  }
}
```

### Get AI Recommendations Log
```http
GET /ai/recommendations-log?workerId=uuid&limit=50
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to 100 requests per 15-minute window per IP address.

## Webhooks

LearnerAI can send webhooks to external systems when certain events occur:

### Events
- `learning_path_completed`
- `skill_gap_updated`
- `assessment_completed`
- `worker_progress_updated`

### Webhook Payload
```json
{
  "event": "learning_path_completed",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "workerId": "uuid",
    "learningPathId": "uuid",
    "finalScore": 85
  }
}
```
