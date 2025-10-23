-- LearnerAI Database Schema
-- This file contains all the SQL commands to set up the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    overall_progress INTEGER DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
    completed_courses INTEGER DEFAULT 0,
    last_assessment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    content TEXT,
    learning_objectives TEXT[],
    expanded_materials JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    final_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning path courses junction table
CREATE TABLE IF NOT EXISTS learning_path_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(learning_path_id, course_id)
);

-- Skill gaps table
CREATE TABLE IF NOT EXISTS skill_gaps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    gap_level VARCHAR(20) NOT NULL CHECK (gap_level IN ('beginner', 'intermediate', 'advanced')),
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    passed BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1),
    answers JSONB,
    time_spent INTEGER, -- in minutes
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker progress tracking table
CREATE TABLE IF NOT EXISTS worker_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    completed_courses INTEGER DEFAULT 0,
    active_learning_paths INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI recommendations log table
CREATE TABLE IF NOT EXISTS ai_recommendations_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    skill_gap_id UUID REFERENCES skill_gaps(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_department ON workers(department);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);
CREATE INDEX IF NOT EXISTS idx_learning_paths_worker_id ON learning_paths(worker_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON learning_paths(status);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_worker_id ON skill_gaps(worker_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_status ON skill_gaps(status);
CREATE INDEX IF NOT EXISTS idx_assessments_worker_id ON assessments(worker_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_worker_id ON ai_recommendations_log(worker_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_timestamp ON ai_recommendations_log(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_gaps_updated_at BEFORE UPDATE ON skill_gaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO workers (name, email, department, position, overall_progress, completed_courses) VALUES
('John Smith', 'john.smith@company.com', 'Engineering', 'Software Developer', 75, 3),
('Sarah Johnson', 'sarah.johnson@company.com', 'Engineering', 'Frontend Developer', 60, 2),
('Mike Wilson', 'mike.wilson@company.com', 'Marketing', 'Digital Marketing Specialist', 45, 1),
('Emily Davis', 'emily.davis@company.com', 'Engineering', 'Backend Developer', 90, 5),
('David Brown', 'david.brown@company.com', 'Sales', 'Sales Manager', 30, 1)
ON CONFLICT (email) DO NOTHING;

INSERT INTO courses (title, description, duration, difficulty, learning_objectives) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', '4 hours', 'beginner', ARRAY['Variables and data types', 'Functions and scope', 'DOM manipulation']),
('React Components', 'Master React component development', '6 hours', 'intermediate', ARRAY['Component lifecycle', 'State management', 'Props and events']),
('API Integration', 'Learn how to integrate with REST APIs', '3 hours', 'intermediate', ARRAY['HTTP methods', 'Authentication', 'Error handling']),
('Advanced JavaScript', 'Deep dive into advanced JavaScript concepts', '8 hours', 'advanced', ARRAY['Closures', 'Prototypes', 'Async programming']),
('Project Management', 'Essential project management skills', '5 hours', 'beginner', ARRAY['Planning', 'Team coordination', 'Risk management'])
ON CONFLICT DO NOTHING;

-- Create sample learning paths
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, status) VALUES
('Frontend Development Path', 'Complete path for frontend developers', 'intermediate', 20, 'draft'),
('Backend Development Path', 'Complete path for backend developers', 'intermediate', 25, 'draft'),
('Full Stack Development Path', 'Comprehensive full-stack development path', 'advanced', 40, 'draft')
ON CONFLICT DO NOTHING;

-- Create sample skill gaps
INSERT INTO skill_gaps (worker_id, skill_name, priority, status, gap_level) 
SELECT 
    w.id,
    'React Hooks',
    'high',
    'pending',
    'intermediate'
FROM workers w 
WHERE w.email = 'john.smith@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO skill_gaps (worker_id, skill_name, priority, status, gap_level) 
SELECT 
    w.id,
    'TypeScript',
    'medium',
    'pending',
    'beginner'
FROM workers w 
WHERE w.email = 'sarah.johnson@company.com'
ON CONFLICT DO NOTHING;
