# LearnerAI - AI-Powered Learning Paths Microservice

## Overview
LearnerAI is a microservice that provides AI-powered personalized learning paths for workers. It integrates with external systems to analyze skill gaps, generate adaptive learning recommendations, and track progress.

## Architecture
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Node.js API (deployed on Railway)
- **Database**: Supabase
- **AI Integration**: Hybrid approach with pre-trained models and fine-tuning capabilities
- **CI/CD**: GitHub Actions

## Key Features
1. **AI-Powered Personalized Learning Paths**: Adaptive, data-driven learning journeys
2. **Course & Content Management**: Course catalog with filtering and enrollment tracking
3. **User Profile & Progress Tracking**: Secure login, dashboard, and progress visualization
4. **Interactive Company Dashboard**: Worker progress tables with filtering and sorting
5. **Real-time Updates**: Immediate notifications to HR and Learning Analytics after exam attempts

## Project Structure
```
learnerAI/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js API backend
├── database/          # Database schema and migrations
├── AI/               # AI models and prompts
├── docs/             # Documentation
├── .github/          # GitHub Actions workflows
└── roadmap.json      # Project roadmap
```

## External System Integration
- **Skills Engine**: Provides skill gap data
- **Course Builder**: Receives learning path recommendations
- **HR System**: Receives worker progress updates
- **Learning Analytics**: Receives completion data
- **RAG System**: Provides contextual course recommendations

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example files)
4. Run development: `npm run dev`

## Environment Setup
- Local: Development environment
- Staging: Testing environment
- Production: Live environment

Each environment has separate Supabase databases for security and isolation.