import express from 'express';
const router = express.Router();

// Get skill gaps for company view
router.get('/', (req, res) => {
  const companyData = global.mockData.company;
  const allSkillGaps = [];
  
  companyData.workers.forEach(worker => {
    worker.skillGaps.forEach(skillGap => {
      allSkillGaps.push({
        id: `${worker.id}-${skillGap.skill.toLowerCase().replace(/\s+/g, '-')}`,
        workerId: worker.id,
        workerName: worker.name,
        department: worker.department,
        skill: skillGap.skill,
        status: skillGap.status,
        priority: skillGap.priority
      });
    });
  });
  
  res.status(200).json(allSkillGaps);
});

// Get skill gaps for specific worker
router.get('/worker/:workerId', (req, res) => {
  const companyData = global.mockData.company;
  const worker = companyData.workers.find(w => w.id === req.params.workerId);
  
  if (worker) {
    res.status(200).json(worker.skillGaps);
  } else {
    res.status(404).json({ message: 'Worker not found' });
  }
});

// Get learner's skill gaps
router.get('/learner/my-gaps', (req, res) => {
  const learnerData = global.mockData.learner;
  res.status(200).json({
    userType: 'learner',
    skillGaps: learnerData.skillGaps
  });
});

export default router;