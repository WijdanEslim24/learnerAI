-- LearnerAI Database Migrations
-- This file contains incremental database changes

-- Migration 001: Initial schema setup
-- Run this first to create all tables and initial data

-- Migration 002: Add indexes for performance (if needed)
-- CREATE INDEX IF NOT EXISTS idx_workers_email ON workers(email);
-- CREATE INDEX IF NOT EXISTS idx_learning_paths_created_at ON learning_paths(created_at);

-- Migration 003: Add new columns (if needed)
-- ALTER TABLE workers ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
-- ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Migration 004: Update constraints (if needed)
-- ALTER TABLE assessments ADD CONSTRAINT check_score_range CHECK (score >= 0 AND score <= 100);

-- To run migrations:
-- 1. Connect to your Supabase database
-- 2. Run each migration in order
-- 3. Test the changes
-- 4. Update this file with new migrations as needed
