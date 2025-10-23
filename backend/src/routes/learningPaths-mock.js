import express from 'express';
const router = express.Router();

// Get learning paths for company view
router.get('/', (req, res) => {
  const companyData = global.mockData.company;
  const learningPaths = companyData.workers.map(worker => ({
    id: worker.learningPath.id,
    name: worker.learningPath.name,
    workerId: worker.id,
    workerName: worker.name,
    status: worker.learningPath.status,
    progress: worker.learningPath.progress,
    startDate: worker.learningPath.startDate,
    estimatedCompletion: worker.learningPath.estimatedCompletion
  }));
  
  res.status(200).json(learningPaths);
});

// Get specific learning path
router.get('/:id', (req, res) => {
  const companyData = global.mockData.company;
  const worker = companyData.workers.find(w => w.learningPath.id === req.params.id);
  
  if (worker) {
    res.status(200).json({
      ...worker.learningPath,
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.email,
        department: worker.department
      }
    });
  } else {
    res.status(404).json({ message: 'Learning path not found' });
  }
});

// Get learner's learning path
router.get('/learner/my-path', (req, res) => {
  const learnerData = global.mockData.learner;
  res.status(200).json({
    userType: 'learner',
    learningPath: {
      ...learnerData.learningPath,
      user: learnerData.user  // Include user data in learning path
    }
  });
});

export default router;