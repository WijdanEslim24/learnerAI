import express from 'express';
const router = express.Router();

// Get analytics for company view
router.get('/', (req, res) => {
  const companyData = global.mockData.company;
  res.status(200).json({
    userType: 'company',
    analytics: companyData.companyAnalytics
  });
});

// Get learner progress analytics
router.get('/learner/progress', (req, res) => {
  const learnerData = global.mockData.learner;
  const learningPath = learnerData.learningPath;
  
  const analytics = {
    userType: 'learner',
    overallProgress: learningPath.progress,
    completedModules: learningPath.modules.filter(m => m.status === 'Completed').length,
    totalModules: learningPath.modules.length,
    averageScore: calculateAverageScore(learningPath.modules),
    timeSpent: calculateTimeSpent(learningPath.modules),
    nextMilestone: getNextMilestone(learningPath.modules),
    achievements: learnerData.achievements
  };
  
  res.status(200).json(analytics);
});

function calculateAverageScore(modules) {
  const completedLessons = modules
    .flatMap(m => m.lessons)
    .filter(l => l.status === 'Completed' && l.score !== null);
  
  if (completedLessons.length === 0) return 0;
  
  const totalScore = completedLessons.reduce((sum, lesson) => sum + lesson.score, 0);
  return Math.round(totalScore / completedLessons.length);
}

function calculateTimeSpent(modules) {
  const completedLessons = modules
    .flatMap(m => m.lessons)
    .filter(l => l.status === 'Completed');
  
  return completedLessons.reduce((total, lesson) => {
    const hours = parseFloat(lesson.duration.split(' ')[0]);
    return total + hours;
  }, 0);
}

function getNextMilestone(modules) {
  const inProgressModule = modules.find(m => m.status === 'In Progress');
  if (inProgressModule) {
    const nextLesson = inProgressModule.lessons.find(l => l.status === 'Not Started');
    return nextLesson ? nextLesson.title : 'Complete current module';
  }
  
  const nextModule = modules.find(m => m.status === 'Not Started');
  return nextModule ? nextModule.title : 'All modules completed!';
}

export default router;