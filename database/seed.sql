-- LearnerAI Database Seed Data
-- This file contains additional sample data for testing and development

-- Additional sample workers
INSERT INTO workers (name, email, department, position, overall_progress, completed_courses) VALUES
('Alice Johnson', 'alice.johnson@company.com', 'Design', 'UX Designer', 85, 4),
('Bob Chen', 'bob.chen@company.com', 'Engineering', 'DevOps Engineer', 70, 2),
('Carol Williams', 'carol.williams@company.com', 'Marketing', 'Content Manager', 55, 3),
('David Rodriguez', 'david.rodriguez@company.com', 'Sales', 'Account Executive', 40, 1),
('Eva Kim', 'eva.kim@company.com', 'Engineering', 'QA Engineer', 90, 6)
ON CONFLICT (email) DO NOTHING;

-- Additional sample courses
INSERT INTO courses (title, description, duration, difficulty, learning_objectives) VALUES
('UI/UX Design Principles', 'Learn fundamental design principles and user experience', '6 hours', 'beginner', ARRAY['Design thinking', 'User research', 'Wireframing']),
('DevOps Fundamentals', 'Introduction to DevOps practices and tools', '8 hours', 'intermediate', ARRAY['CI/CD', 'Containerization', 'Monitoring']),
('Content Marketing Strategy', 'Strategic approach to content marketing', '4 hours', 'intermediate', ARRAY['Content planning', 'SEO', 'Analytics']),
('Sales Techniques', 'Advanced sales methodologies and techniques', '5 hours', 'intermediate', ARRAY['Prospecting', 'Negotiation', 'Closing']),
('Quality Assurance Testing', 'Comprehensive QA testing methodologies', '7 hours', 'advanced', ARRAY['Test planning', 'Automation', 'Bug tracking'])
ON CONFLICT DO NOTHING;

-- Additional learning paths
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, status) VALUES
('Design Thinking Path', 'Complete design thinking methodology', 'intermediate', 30, 'draft'),
('DevOps Mastery Path', 'Advanced DevOps practices and tools', 'advanced', 50, 'draft'),
('Marketing Excellence Path', 'Comprehensive marketing skills', 'intermediate', 35, 'draft'),
('Sales Leadership Path', 'Leadership skills for sales professionals', 'advanced', 45, 'draft'),
('Quality Engineering Path', 'Advanced QA and testing skills', 'advanced', 40, 'draft')
ON CONFLICT DO NOTHING;

-- Additional skill gaps for existing workers
INSERT INTO skill_gaps (worker_id, skill_name, priority, status, gap_level) 
SELECT 
    w.id,
    'Figma Design',
    'high',
    'pending',
    'intermediate'
FROM workers w 
WHERE w.email = 'alice.johnson@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO skill_gaps (worker_id, skill_name, priority, status, gap_level) 
SELECT 
    w.id,
    'Docker',
    'medium',
    'pending',
    'beginner'
FROM workers w 
WHERE w.email = 'bob.chen@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO skill_gaps (worker_id, skill_name, priority, status, gap_level) 
SELECT 
    w.id,
    'SEO Optimization',
    'high',
    'pending',
    'intermediate'
FROM workers w 
WHERE w.email = 'carol.williams@company.com'
ON CONFLICT DO NOTHING;

-- Sample assessments
INSERT INTO assessments (worker_id, course_id, score, passed, attempt_number, completed_at) VALUES
((SELECT id FROM workers WHERE email = 'john.smith@company.com'), 
 (SELECT id FROM courses WHERE title = 'JavaScript Fundamentals'), 
 85, true, 1, NOW() - INTERVAL '5 days'),

((SELECT id FROM workers WHERE email = 'sarah.johnson@company.com'), 
 (SELECT id FROM courses WHERE title = 'React Components'), 
 72, true, 1, NOW() - INTERVAL '3 days'),

((SELECT id FROM workers WHERE email = 'mike.wilson@company.com'), 
 (SELECT id FROM courses WHERE title = 'Project Management'), 
 45, false, 1, NOW() - INTERVAL '2 days'),

((SELECT id FROM workers WHERE email = 'emily.davis@company.com'), 
 (SELECT id FROM courses WHERE title = 'API Integration'), 
 92, true, 1, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Sample AI recommendations log
INSERT INTO ai_recommendations_log (worker_id, action, data, timestamp) VALUES
((SELECT id FROM workers WHERE email = 'john.smith@company.com'), 
 'learning_path_generated', 
 '{"skillGaps": ["React Hooks", "TypeScript"], "courses": ["React Advanced", "TypeScript Basics"]}', 
 NOW() - INTERVAL '7 days'),

((SELECT id FROM workers WHERE email = 'sarah.johnson@company.com'), 
 'skill_gap_analysis_completed', 
 '{"skillGaps": ["JavaScript ES6", "CSS Grid"], "confidence": 0.85}', 
 NOW() - INTERVAL '5 days'),

((SELECT id FROM workers WHERE email = 'emily.davis@company.com'), 
 'materials_expanded', 
 '{"courseId": "api-integration-course", "additionalResources": 5}', 
 NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Sample worker progress records
INSERT INTO worker_progress (worker_id, progress, completed_courses, active_learning_paths) VALUES
((SELECT id FROM workers WHERE email = 'john.smith@company.com'), 75, 3, 1),
((SELECT id FROM workers WHERE email = 'sarah.johnson@company.com'), 60, 2, 1),
((SELECT id FROM workers WHERE email = 'mike.wilson@company.com'), 45, 1, 0),
((SELECT id FROM workers WHERE email = 'emily.davis@company.com'), 90, 5, 1),
((SELECT id FROM workers WHERE email = 'david.brown@company.com'), 30, 1, 0)
ON CONFLICT DO NOTHING;
