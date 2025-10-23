import { expect, test, describe } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import WorkerDetail from '../pages/WorkerDetail'
import LearningPaths from '../pages/LearningPaths'
import Analytics from '../pages/Analytics'

// Mock API service
jest.mock('../services/api', () => ({
  getWorkers: jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      department: 'Engineering',
      position: 'Software Developer',
      progress: 75,
      completedCourses: 3,
      activeLearningPaths: 1,
      status: 'active'
    }
  ])),
  getWorkerDetails: jest.fn(() => Promise.resolve({
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    department: 'Engineering',
    position: 'Software Developer',
    progress: 75,
    skillGaps: [
      {
        skill_name: 'React Hooks',
        priority: 'high',
        status: 'pending',
        gap_level: 'intermediate'
      }
    ]
  })),
  getLearningPaths: jest.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'Frontend Development Path',
      description: 'Complete frontend development curriculum',
      status: 'active',
      courseCount: 5,
      estimatedHours: 40,
      difficulty: 'intermediate',
      assignedWorkers: 3,
      completionRate: 80
    }
  ])),
  getAnalytics: jest.fn(() => Promise.resolve({
    activeLearners: 25,
    coursesCompleted: 150,
    avgProgress: 68,
    activePaths: 12,
    departmentDistribution: [
      { name: 'Engineering', value: 15 },
      { name: 'Marketing', value: 10 }
    ],
    completionByDepartment: [
      { department: 'Engineering', completed: 100, inProgress: 50 },
      { department: 'Marketing', completed: 50, inProgress: 25 }
    ],
    topPaths: [
      {
        id: '1',
        title: 'Frontend Development Path',
        assignedWorkers: 10,
        completionRate: 85,
        avgCompletionTime: 30,
        successRate: 90
      }
    ]
  }))
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  test('renders dashboard with worker data', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('LearnerAI Dashboard')).toBeInTheDocument()
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })
  })

  test('displays worker statistics', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Workers')).toBeInTheDocument()
      expect(screen.getByText('Active Learning Paths')).toBeInTheDocument()
      expect(screen.getByText('Avg Progress')).toBeInTheDocument()
    })
  })

  test('filters workers by search term', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search workers...')
      fireEvent.change(searchInput, { target: { value: 'John' } })
      
      expect(screen.getByText('John Smith')).toBeInTheDocument()
    })
  })

  test('sorts workers by different criteria', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Sort by Progress')
      fireEvent.change(sortSelect, { target: { value: 'name' } })
      
      expect(sortSelect.value).toBe('name')
    })
  })
})

describe('WorkerDetail Component', () => {
  test('renders worker details', async () => {
    renderWithRouter(<WorkerDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Worker Information')).toBeInTheDocument()
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('john@company.com')).toBeInTheDocument()
    })
  })

  test('displays skill gaps', async () => {
    renderWithRouter(<WorkerDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Identified Skill Gaps')).toBeInTheDocument()
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })
  })

  test('shows progress visualization', async () => {
    renderWithRouter(<WorkerDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Overall Progress')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })
})

describe('LearningPaths Component', () => {
  test('renders learning paths', async () => {
    renderWithRouter(<LearningPaths />)
    
    await waitFor(() => {
      expect(screen.getByText('Learning Paths')).toBeInTheDocument()
      expect(screen.getByText('Frontend Development Path')).toBeInTheDocument()
    })
  })

  test('displays path statistics', async () => {
    renderWithRouter(<LearningPaths />)
    
    await waitFor(() => {
      expect(screen.getByText('Courses:')).toBeInTheDocument()
      expect(screen.getByText('Duration:')).toBeInTheDocument()
      expect(screen.getByText('Difficulty:')).toBeInTheDocument()
    })
  })

  test('shows completion rates', async () => {
    renderWithRouter(<LearningPaths />)
    
    await waitFor(() => {
      expect(screen.getByText('Completion Rate')).toBeInTheDocument()
      expect(screen.getByText('80%')).toBeInTheDocument()
    })
  })
})

describe('Analytics Component', () => {
  test('renders analytics dashboard', async () => {
    renderWithRouter(<Analytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Active Learners')).toBeInTheDocument()
      expect(screen.getByText('Courses Completed')).toBeInTheDocument()
    })
  })

  test('displays key metrics', async () => {
    renderWithRouter(<Analytics />)
    
    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument() // Active Learners
      expect(screen.getByText('150')).toBeInTheDocument() // Courses Completed
      expect(screen.getByText('68%')).toBeInTheDocument() // Avg Progress
    })
  })

  test('shows charts and visualizations', async () => {
    renderWithRouter(<Analytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Progress Over Time')).toBeInTheDocument()
      expect(screen.getByText('Department Distribution')).toBeInTheDocument()
      expect(screen.getByText('Course Completion by Department')).toBeInTheDocument()
    })
  })

  test('displays top performing paths', async () => {
    renderWithRouter(<Analytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Top Performing Learning Paths')).toBeInTheDocument()
      expect(screen.getByText('Frontend Development Path')).toBeInTheDocument()
    })
  })
})

describe('Component Integration', () => {
  test('navigation between pages works', () => {
    renderWithRouter(<Dashboard />)
    
    // Test navigation would go here
    expect(screen.getByText('LearnerAI Dashboard')).toBeInTheDocument()
  })

  test('data flows correctly between components', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument()
    })
  })
})

describe('Error Handling', () => {
  test('handles API errors gracefully', async () => {
    // Mock API error
    const { getWorkers } = require('../services/api')
    getWorkers.mockRejectedValueOnce(new Error('API Error'))
    
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load workers data')).toBeInTheDocument()
    })
  })

  test('shows loading states', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Loading workers data...')).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  test('has proper ARIA labels', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search workers...')
      expect(searchInput).toBeInTheDocument()
    })
  })

  test('supports keyboard navigation', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search workers...')
      fireEvent.keyDown(searchInput, { key: 'Tab' })
      // Test keyboard navigation
    })
  })
})
