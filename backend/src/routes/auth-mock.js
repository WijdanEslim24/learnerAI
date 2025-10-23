import express from 'express';
const router = express.Router();

// Mock auth routes - just return success for demo purposes
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Mock login successful',
    user: {
      id: 'mock-user',
      email: 'demo@example.com',
      type: 'learner'
    }
  });
});

router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: 'Mock registration successful',
    user: {
      id: 'mock-user',
      email: 'demo@example.com',
      type: 'learner'
    }
  });
});

router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'mock-user',
      email: 'demo@example.com',
      type: 'learner'
    }
  });
});

export default router;
