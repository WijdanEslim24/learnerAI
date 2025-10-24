import express from 'express';
const router = express.Router();

// Get learning paths for company view
router.get('/', (req, res) => {
  const companyData = global.mockData.company;

  // From the new structure, produce a list of learning paths (one per course
  // learningPath entry) to mimic the old endpoint.
  const learningPaths = [];
  (companyData.workers || []).forEach(worker => {
    (worker.courses || []).forEach(course => {
      (course.learningPaths || []).forEach(lp => {
        learningPaths.push({
          id: lp.id,
          name: `${course.name} - ${lp.summary || ''}`,
          workerId: worker.workerId,
          workerName: worker.workerName,
          status: lp.expanded ? 'active' : 'draft',
          progress: lp.expanded ? 50 : 0,
          startDate: lp.generatedAt,
          estimatedCompletion: null
        })
      })
    })
  })

  res.status(200).json(learningPaths);
});

// Search courses across all workers' learning paths. Query: q
router.get('/courses/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

  const companyData = global.mockData.company;
  const results = [];

  (companyData.workers || []).forEach(worker => {
    (worker.courses || []).forEach(course => {
      if (course.name && course.name.toLowerCase().includes(q)) {
        // pick the first learningPath for context
        const lp = (course.learningPaths && course.learningPaths[0]) || {}
        results.push({
          courseId: course.id,
          title: course.name,
          learningPathId: lp.id,
          learningPathTitle: lp.summary || lp.id,
          workerId: worker.workerId,
          workerName: worker.workerName
        })
      }
    })
  })

  res.status(200).json(results);
});

// Get specific learning path
router.get('/:id', (req, res) => {
  const companyData = global.mockData.company;
  const lpId = req.params.id;

  // search through workers -> courses -> learningPaths
  for (const worker of (companyData.workers || [])) {
    for (const course of (worker.courses || [])) {
      for (const lp of (course.learningPaths || [])) {
        if (lp.id === lpId) {
          return res.status(200).json({
            id: lp.id,
            summary: lp.summary,
            generatedAt: lp.generatedAt,
            expanded: lp.expanded,
            course: {
              id: course.id,
              title: course.name
            },
            worker: {
              id: worker.workerId,
              name: worker.workerName
            }
          })
        }
      }
    }
  }

  res.status(404).json({ message: 'Learning path not found' });
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