import express from 'express';
const router = express.Router();

// Get all workers (for company view)
router.get('/', (req, res) => {
  const companyData = global.mockData.company;
  res.status(200).json({
    userType: 'company',
    company: companyData.company,
    workers: companyData.workers,
    analytics: companyData.companyAnalytics
  });
});

// Get specific worker
router.get('/:id', (req, res) => {
  const companyData = global.mockData.company;
  const worker = companyData.workers.find(w => w.id === req.params.id);
  
  if (worker) {
    res.status(200).json(worker);
  } else {
    res.status(404).json({ message: 'Worker not found' });
  }
});

// Get learner data (for learner view)
router.get('/learner/profile', (req, res) => {
  const learnerData = global.mockData.learner;
  res.status(200).json({
    userType: 'learner',
    user: learnerData.user,
    learningPath: learnerData.learningPath,
    skillGaps: learnerData.skillGaps,
    achievements: learnerData.achievements
  });
});

export default router;