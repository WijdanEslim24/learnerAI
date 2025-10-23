# AI Models and Prompts for LearnerAI

## Overview
This directory contains AI models, prompts, and related components for the LearnerAI microservice.

## Structure
```
AI/
├── models/           # AI model files and configurations
├── prompts/          # Prompt templates and versions
├── scripts/          # AI processing scripts
├── tests/            # AI model tests
└── requirements.txt  # Python dependencies
```

## Models
- Learning Path Generator: Creates personalized learning paths based on skill gaps
- Material Expander: Enhances course content with AI-generated materials
- Skill Gap Analyzer: Analyzes assessment results to identify skill gaps
- Progress Predictor: Predicts learning progress and completion times

## Prompts
- Learning path generation prompts
- Material expansion prompts
- Skill gap analysis prompts
- Assessment question generation prompts

## Usage
1. Install Python dependencies: `pip install -r requirements.txt`
2. Run tests: `python -m pytest tests/`
3. Deploy models: Use the GitHub Actions workflow with manual approval
