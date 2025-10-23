# LearnerAI Database Setup Guide

## Overview
This directory contains all database-related files for the LearnerAI project using Supabase (PostgreSQL).

## Files

### `schema.sql`
- **Purpose**: Main database schema with all tables, indexes, triggers, and constraints
- **Usage**: Run this first to create the complete database structure
- **Contains**: 
  - Table definitions (workers, courses, learning_paths, skill_gaps, assessments, etc.)
  - Indexes for performance optimization
  - Triggers for automatic timestamp updates
  - Sample data for development

### `seed.sql`
- **Purpose**: Additional sample data for testing and development
- **Usage**: Run after schema.sql for more comprehensive test data
- **Contains**:
  - Additional workers, courses, and learning paths
  - Sample assessments and progress records
  - AI recommendations log entries
  - Skill gaps for testing

### `migrations.sql`
- **Purpose**: Database migration template for future changes
- **Usage**: Use this file to track incremental database changes
- **Contains**:
  - Migration examples and templates
  - Guidelines for database updates

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `schema.sql`
3. Execute the SQL script
4. Verify tables are created

### 3. Add Sample Data (Optional)
1. Copy and paste the contents of `seed.sql`
2. Execute the SQL script
3. Verify sample data is inserted

### 4. Verify Setup
Run these queries to verify everything is working:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check sample data
SELECT COUNT(*) FROM workers;
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM learning_paths;

-- Check relationships
SELECT w.name, lp.title 
FROM workers w 
JOIN learning_paths lp ON w.id = lp.worker_id;
```

## Database Schema Overview

### Core Tables
- **workers**: Employee information and progress tracking
- **courses**: Individual course content and metadata
- **learning_paths**: Structured learning sequences
- **skill_gaps**: Identified learning needs per worker
- **assessments**: Course completion and scoring data

### Supporting Tables
- **learning_path_courses**: Many-to-many relationship between paths and courses
- **worker_progress**: Historical progress tracking
- **ai_recommendations_log**: AI system activity logging

### Key Features
- **UUID Primary Keys**: All tables use UUID for better scalability
- **Automatic Timestamps**: Created/updated timestamps managed by triggers
- **Row Level Security**: Ready for Supabase RLS policies
- **Performance Indexes**: Optimized for common query patterns
- **Data Integrity**: Foreign key constraints and check constraints

## Environment Variables

Make sure these are set in your backend `.env` file:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Troubleshooting

### Common Issues

1. **Permission Errors**:
   - Ensure you're using the correct API keys
   - Check if RLS policies are blocking access

2. **Schema Errors**:
   - Verify all SQL syntax is correct
   - Check if extensions are enabled

3. **Data Issues**:
   - Ensure foreign key relationships are correct
   - Check if sample data conflicts with existing data

### Useful Queries

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check recent activity
SELECT * FROM ai_recommendations_log 
ORDER BY timestamp DESC 
LIMIT 10;
```

## Production Considerations

1. **Backup Strategy**: Set up regular database backups
2. **Monitoring**: Monitor database performance and usage
3. **Scaling**: Consider read replicas for high-traffic scenarios
4. **Security**: Implement proper RLS policies for production
5. **Maintenance**: Regular VACUUM and ANALYZE operations
