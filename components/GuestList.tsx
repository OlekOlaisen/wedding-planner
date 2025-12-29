'use client'

import { useState, useMemo } from 'react'
import { Guest, GUEST_CATEGORIES, GuestCategory, SortOption } from '@/types/guest'
import GuestDetailsModal from './GuestDetailsModal'

interface GuestListProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

export default function GuestList({ guests, onEdit, onDelete }: GuestListProps) {
  const [selectedCategory, setSelectedCategory] = useState<GuestCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  const filteredAndSortedGuests = useMemo(() => {
    let filtered = guests

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((guest) => guest.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query) ||
          guest.notes?.toLowerCase().includes(query) ||
          guest.category.toLowerCase().includes(query)
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'grade-asc':
          const gradeOrder = { A: 1, B: 2, C: 3, D: 4, F: 5 }
          return gradeOrder[a.finalGrade] - gradeOrder[b.finalGrade]
        case 'grade-desc':
          const gradeOrderDesc = { A: 1, B: 2, C: 3, D: 4, F: 5 }
          return gradeOrderDesc[b.finalGrade] - gradeOrderDesc[a.finalGrade]
        case 'category-asc':
          return a.category.localeCompare(b.category)
        case 'groom-rating-desc':
          return b.groomRating - a.groomRating
        case 'bridesmaid-rating-desc':
          return b.bridesmaidRating - a.bridesmaidRating
        case 'attendance-desc':
          return b.attendancePossibility - a.attendancePossibility
        default:
          return 0
      }
    })

    return sorted
  }, [guests, selectedCategory, searchQuery, sortOption])

  if (guests.length === 0) {
    return (
      <div className="empty-state">
        <p>No guests added yet. Add your first guest to get started!</p>
      </div>
    )
  }

  const getGradeColor = (grade: Guest['finalGrade']) => {
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

  const getCategoryColor = (category: GuestCategory) => {
    const colors: Record<GuestCategory, string> = {
      'Bridal Party': '#ec4899',
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

  return (
    <div className="guest-list">
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or notes..."
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GuestCategory | 'All')}
              className="category-filter-select"
            >
              <option value="All">All Categories</option>
              {GUEST_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="grade-asc">Grade (A-F)</option>
              <option value="grade-desc">Grade (F-A)</option>
              <option value="category-asc">Category</option>
              <option value="groom-rating-desc">Groom Rating (High-Low)</option>
              <option value="bridesmaid-rating-desc">Bridesmaid Rating (High-Low)</option>
              <option value="attendance-desc">Attendance (High-Low)</option>
            </select>
          </div>
        </div>
        <span className="filter-count">
          Showing {filteredAndSortedGuests.length} of {guests.length} guests
        </span>
      </div>

      <table className="guest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Groom Rating</th>
            <th>Bridesmaid Rating</th>
            <th>Attendance Possibility</th>
            <th>Final Grade</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedGuests.map((guest) => (
            <tr key={guest.id} className="guest-row" onClick={() => setSelectedGuest(guest)}>
              <td className="name-cell">
                <div>
                  {guest.name}
                  {guest.notes && (
                    <span className="has-notes" title={guest.notes}>📝</span>
                  )}
                </div>
              </td>
              <td>
                <span
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(guest.category) }}
                >
                  {guest.category}
                </span>
              </td>
              <td>{guest.groomRating}/10</td>
              <td>{guest.bridesmaidRating}/10</td>
              <td>{guest.attendancePossibility}/10</td>
              <td>
                <span
                  className="grade-badge"
                  style={{ backgroundColor: getGradeColor(guest.finalGrade) }}
                >
                  {guest.finalGrade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredAndSortedGuests.length === 0 && (selectedCategory !== 'All' || searchQuery.trim()) && (
        <div className="empty-state">
          <p>No guests found matching your filters.</p>
        </div>
      )}

      {selectedGuest && (
        <GuestDetailsModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

