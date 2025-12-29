'use client'

import { Guest } from '@/types/guest'

interface StatisticsProps {
  guests: Guest[]
}

export default function Statistics({ guests }: StatisticsProps) {
  if (guests.length === 0) {
    return null
  }

  const totalGuests = guests.length
  const averageAttendance = guests.reduce((sum, g) => sum + g.attendancePossibility, 0) / totalGuests
  
  // Expected attendance based on attendance possibility (using 70% threshold as likely to attend)
  const expectedAttendance = guests.filter(g => g.attendancePossibility >= 7).length
  
  // High priority guests (A and B grades)
  const highPriorityGuests = guests.filter(g => g.finalGrade === 'A' || g.finalGrade === 'B').length
  
  // Category breakdown
  const categoryDistribution = guests.reduce((acc, guest) => {
    acc[guest.category] = (acc[guest.category] || 0) + 1
    return acc
  }, {} as Record<Guest['category'], number>)

  const gradeDistribution = guests.reduce((acc, guest) => {
    acc[guest.finalGrade] = (acc[guest.finalGrade] || 0) + 1
    return acc
  }, {} as Record<Guest['finalGrade'], number>)

  const topRatedGuests = [...guests]
    .sort((a, b) => {
      const scoreA = (a.groomRating + a.bridesmaidRating) / 2
      const scoreB = (b.groomRating + b.bridesmaidRating) / 2
      return scoreB - scoreA
    })
    .slice(0, 3)

  // Most represented category
  const topCategory = Object.entries(categoryDistribution)
    .sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="statistics-panel">
      <h3>Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalGuests}</div>
          <div className="stat-label">Total Guests</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{expectedAttendance}</div>
          <div className="stat-label">Expected Attendance</div>
          <div className="stat-sublabel">(Likely to attend)</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{averageAttendance.toFixed(1)}</div>
          <div className="stat-label">Avg Attendance Likelihood</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{highPriorityGuests}</div>
          <div className="stat-label">High Priority Guests</div>
          <div className="stat-sublabel">(A & B grades)</div>
        </div>
      </div>

      <div className="stats-section">
        <h4>Category Breakdown</h4>
        <div className="category-breakdown">
          {Object.entries(categoryDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <div key={category} className="category-stat-item">
                <div className="category-stat-header">
                  <span className="category-stat-name">{category}</span>
                  <span className="category-stat-count">{count}</span>
                </div>
                <div className="category-stat-bar">
                  <div 
                    className="category-stat-bar-fill" 
                    style={{ width: `${(count / totalGuests) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="stats-section">
        <h4>Grade Distribution</h4>
        <div className="grade-stats">
          {(['A', 'B', 'C', 'D', 'F'] as const).map((grade) => {
            const count = gradeDistribution[grade] || 0
            const percentage = totalGuests > 0 ? (count / totalGuests) * 100 : 0
            const gradeColor = getGradeColor(grade)
            return (
              <div key={grade} className="grade-stat-item">
                <div className="grade-stat-header">
                  <span className="grade-stat-label">{grade}:</span>
                  <span className="grade-stat-value">{count}</span>
                  <span className="grade-stat-percentage">({percentage.toFixed(0)}%)</span>
                </div>
                <div className="grade-stat-bar">
                  <div 
                    className="grade-stat-bar-fill" 
                    style={{ width: `${percentage}%`, backgroundColor: gradeColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="stats-section">
        <h4>Top Rated Guests</h4>
        <div className="top-guests">
          {topRatedGuests.map((guest, index) => (
            <div key={guest.id} className="top-guest-item">
              <span className="rank">#{index + 1}</span>
              <span className="name">{guest.name}</span>
              <span className="category-badge-small" style={{ 
                backgroundColor: getCategoryColor(guest.category) 
              }}>
                {guest.category}
              </span>
              <span className="score">
                {((guest.groomRating + guest.bridesmaidRating) / 2).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(category: Guest['category']): string {
  const colors: Record<Guest['category'], string> = {
    'Close Family': '#ec4899',
    'Groom\'s Family': '#3b82f6',
    'Bride\'s Family': '#ef4444',
    'Close Friends': '#10b981',
    'Friends': '#06b6d4',
    'Colleagues': '#f59e0b',
    'Out of Town': '#8b5cf6',
    'Significant Other': '#f97316',
    'Vendors': '#6366f1',
    'Other': '#6b7280',
  }
  return colors[category] || '#6b7280'
}

function getGradeColor(grade: Guest['finalGrade']): string {
  switch (grade) {
    case 'A':
      return '#10b981'
    case 'B':
      return '#3b82f6'
    case 'C':
      return '#f59e0b'
    case 'D':
      return '#ef4444'
    case 'F':
      return '#991b1b'
    default:
      return '#6b7280'
  }
}

