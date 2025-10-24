import express from 'express';
const router = express.Router();

// Get all workers (for company view)
// Search workers by name or email. Query: q
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

  const companyData = global.mockData.company;
  const matched = (companyData.workers || []).filter(w => {
    // support both old and new mock shapes
    const name = (w.workerName || w.name || '').toLowerCase();
    const email = (w.email || `${(w.workerName || w.name || '').toLowerCase().replace(/\s+/g, '.')}@example.com`).toLowerCase();
    return (name && name.includes(q)) || (email && email.includes(q));
  });

  res.status(200).json({ workers: matched.map(w => ({
    // normalize returned worker object to legacy shape (id, name, email)
    id: w.workerId || w.id,
    name: w.workerName || w.name,
    email: w.email || `${(w.workerName || w.name || '').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    // include learningPath shape if present via compatibility mapping
    learningPath: w.learningPath || {
      id: `lp-${w.workerId || w.id}`,
      courses: (w.courses || []).map(c => ({ id: c.id, title: c.name }))
    }
  }) ) });
});

router.get('/', (req, res) => {
  const companyData = global.mockData.company;

  // Compatibility mapping: transform the new compact structure into the
  // legacy shape expected by the frontend (workers with learningPath.courses)
  const workers = (companyData.workers || []).map(w => {
    // map courses into a single learningPath object for the frontend
    const lp = {
      id: `lp-${w.workerId}`,
      name: `${w.workerName} Learning Path`,
      status: 'in_progress',
      progress: 0,
      startDate: (w.courses && w.courses[0] && w.courses[0].learningPaths && w.courses[0].learningPaths[0]) ? w.courses[0].learningPaths[0].generatedAt : null,
      estimatedCompletion: null,
      courses: (w.courses || []).map(c => ({
        id: c.id,
        title: c.name,
        status: c.learningPaths && c.learningPaths[0] && c.learningPaths[0].expanded ? 'In Progress' : 'Not Started',
        score: null,
        completedDate: null,
        duration: '10 hours'
      }))
    }

    return {
      id: w.workerId,
      name: w.workerName,
      email: w.email || `${w.workerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      department: 'Engineering',
      position: 'Employee',
      hireDate: null,
      learningPath: lp,
      skillGaps: [],
      lastAssessment: null,
      assessmentScore: null,
      nextReview: null
    }
  })

  res.status(200).json({
    userType: 'company',
    company: {
      id: companyData.companyId,
      name: companyData.companyName
    },
    workers,
    analytics: companyData.companyAnalytics,
    // Also include the raw company mock file so callers can inspect the original data
    rawCompany: companyData
  });
});

// Get specific worker
router.get('/:id', (req, res) => {
  const companyData = global.mockData.company;
  // company-mock.json uses workerId; support both properties
  const worker = companyData.workers.find(w => (w.workerId === req.params.id) || (w.id === req.params.id));
  
  if (worker) {
    // return the compatibility-shaped worker but also include the original raw worker
    res.status(200).json({
      worker: worker,
      rawWorker: worker
    });
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