# LearnerAI Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [API Documentation](#api-documentation)
5. [Frontend Guide](#frontend-guide)
6. [AI Integration](#ai-integration)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## Overview

LearnerAI is a microservice that provides AI-powered personalized learning paths for workers. It integrates with external systems to analyze skill gaps, generate adaptive learning recommendations, and track progress.

### Key Features
- **AI-Powered Learning Paths**: Personalized recommendations based on skill gap analysis
- **Real-time Progress Tracking**: Monitor worker progress and completion rates
- **Interactive Dashboard**: Company-wide view of worker learning progress
- **External System Integration**: Seamless integration with HR, Learning Analytics, and other systems
- **Comprehensive Analytics**: Detailed insights into learning effectiveness

## Architecture

### Technology Stack
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Railway)
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT models with custom prompts
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging + custom analytics

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Supabase DB   │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   AI Models     │
│   (Hosting)     │    │   (Hosting)     │    │   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### External System Integration
- **Skills Engine**: Provides skill gap analysis data
- **Course Builder**: Receives learning path recommendations
- **HR System**: Receives worker progress updates
- **Learning Analytics**: Receives completion data
- **RAG System**: Provides contextual course recommendations

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/learner-ai.git
   cd learner-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

4. **Set up Supabase database**
   ```bash
   # Run the schema.sql file in your Supabase SQL editor
   # Or use the Supabase CLI
   supabase db reset
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:5000
   ```

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-railway-app.railway.app/api`

### Authentication
All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Workers
- `GET /workers` - Get all workers with progress
- `GET /workers/:id` - Get worker details
- `GET /workers/:id/progress` - Get worker progress history
- `GET /workers/:id/learning-path` - Get worker's active learning path
- `POST /workers/:id/skill-gaps` - Update worker skill gaps
- `POST /workers/:id/assessment-result` - Record assessment result

#### Learning Paths
- `GET /learning-paths` - Get all learning paths
- `GET /learning-paths/:id` - Get learning path details
- `POST /learning-paths` - Create new learning path
- `PUT /learning-paths/:id` - Update learning path
- `POST /learning-paths/:id/assign` - Assign path to worker
- `POST /learning-paths/:id/complete` - Mark path as completed

#### Skill Gaps
- `GET /skill-gaps/:workerId` - Get worker's skill gaps
- `POST /skill-gaps/:workerId` - Update worker's skill gaps
- `PUT /skill-gaps/:workerId/:skillId/complete` - Mark skill gap as completed
- `POST /skill-gaps/:workerId/analyze` - Trigger skill gap analysis

#### Analytics
- `GET /analytics` - Get analytics data
- `GET /analytics/progress` - Get progress metrics over time
- `GET /analytics/worker-performance` - Get worker performance metrics

#### AI Integration
- `POST /ai/generate-learning-path` - Generate AI learning path
- `POST /ai/expand-materials` - Expand course materials with AI
- `GET /ai/recommendations-log` - Get AI recommendations log
- `POST /ai/analyze-skill-gaps` - Trigger AI skill gap analysis
- `GET /ai/model-performance` - Get AI model performance metrics

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "error": "Error message"
}
```

## Frontend Guide

### Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API service functions
│   ├── utils/         # Utility functions
│   └── styles/        # CSS styles
├── public/            # Static assets
└── package.json
```

### Key Components

#### Dashboard
- **Location**: `src/pages/Dashboard.jsx`
- **Features**: Worker progress overview, filtering, sorting
- **API Calls**: `getWorkers()`, `getWorkerProgress()`

#### Worker Detail
- **Location**: `src/pages/WorkerDetail.jsx`
- **Features**: Individual worker progress, learning path details
- **API Calls**: `getWorkerDetails()`, `getWorkerLearningPath()`

#### Learning Paths
- **Location**: `src/pages/LearningPaths.jsx`
- **Features**: Learning path management, creation
- **API Calls**: `getLearningPaths()`, `createLearningPath()`

#### Analytics
- **Location**: `src/pages/Analytics.jsx`
- **Features**: Charts, metrics, performance data
- **API Calls**: `getAnalytics()`, `getProgressMetrics()`

### Styling
The frontend uses a custom CSS approach with utility classes. Key styling patterns:
- `.card` - Card containers
- `.btn` - Button styles
- `.table` - Table styling
- `.form-input` - Form input styling

## AI Integration

### AI Models
1. **Learning Path Generator**: Creates personalized learning paths
2. **Material Expander**: Enhances course content
3. **Skill Gap Analyzer**: Identifies learning gaps
4. **Progress Predictor**: Predicts completion times

### Prompt Management
- **Location**: `AI/prompts/`
- **Versioning**: Prompts are versioned for tracking changes
- **Templates**: Reusable prompt templates for different scenarios

### AI Service Integration
```javascript
// Example AI service call
const response = await fetch('/api/ai/generate-learning-path', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    workerId: 'worker-123',
    skillGaps: skillGapsData
  })
})
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Database (Supabase)
1. Create a new Supabase project
2. Run the schema.sql file
3. Set up Row Level Security (RLS) policies
4. Configure API keys

### CI/CD Pipeline
The GitHub Actions workflow automatically:
- Runs tests on pull requests
- Builds and deploys frontend to Vercel
- Builds and deploys backend to Railway
- Requires manual approval for AI model deployments

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Standards
- Use ESLint for JavaScript/React
- Follow the existing code style
- Write comprehensive tests
- Update documentation

### Testing
```bash
# Run all tests
npm run test

# Run frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && npm run test
```

## Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the API examples

## License

This project is licensed under the MIT License - see the LICENSE file for details.
