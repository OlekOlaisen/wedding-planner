'use client'

import { Guest } from '@/types/guest'

interface GuestDetailsModalProps {
  guest: Guest
  onClose: () => void
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

export default function GuestDetailsModal({ guest, onClose, onEdit, onDelete }: GuestDetailsModalProps) {
  const getCategoryColor = (category: Guest['category']) => {
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

  const averageRating = ((guest.groomRating + guest.bridesmaidRating) / 2).toFixed(1)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content guest-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Guest Details</h3>
          <button onClick={onClose} className="modal-close-button" aria-label="Close">
            ×
          </button>
        </div>

        <div className="guest-details-content">
          <div className="guest-detail-section">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{guest.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(guest.category) }}
              >
                {guest.category}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Final Grade</span>
              <span
                className="grade-badge"
                style={{ backgroundColor: getGradeColor(guest.finalGrade) }}
              >
                {guest.finalGrade}
              </span>
            </div>
          </div>

          <div className="guest-detail-section">
            <h4>Ratings</h4>
            <div className="ratings-grid">
              <div className="rating-item">
                <span className="rating-label">Groom Rating</span>
                <div className="rating-display">
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${(guest.groomRating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="rating-value">{guest.groomRating}/10</span>
                </div>
              </div>

              <div className="rating-item">
                <span className="rating-label">Bridesmaid Rating</span>
                <div className="rating-display">
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${(guest.bridesmaidRating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="rating-value">{guest.bridesmaidRating}/10</span>
                </div>
              </div>

              <div className="rating-item">
                <span className="rating-label">Attendance Possibility</span>
                <div className="rating-display">
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${(guest.attendancePossibility / 10) * 100}%` }}
                    />
                  </div>
                  <span className="rating-value">{guest.attendancePossibility}/10</span>
                </div>
              </div>

              <div className="rating-item">
                <span className="rating-label">Average Rating</span>
                <div className="rating-display">
                  <span className="rating-value-large">{averageRating}/10</span>
                </div>
              </div>
            </div>
          </div>

          {guest.notes && (
            <div className="guest-detail-section">
              <h4>Notes</h4>
              <div className="notes-content">
                {guest.notes}
              </div>
            </div>
          )}

          <div className="guest-detail-section">
            <h4>Status</h4>
            <div className="status-grid">
              <div className={`status-badge ${guest.inviteSent ? 'status-active' : 'status-inactive'}`}>
                <div className="status-badge-icon">
                  {guest.inviteSent ? '✓' : '○'}
                </div>
                <div className="status-badge-content">
                  <span className="status-badge-label">Invite Sent</span>
                  <span className="status-badge-value">
                    {guest.inviteSent ? 'Sent' : 'Not Sent'}
                  </span>
                </div>
              </div>
              <div className={`status-badge ${guest.confirmation ? 'status-active' : 'status-inactive'}`}>
                <div className="status-badge-icon">
                  {guest.confirmation ? '✓' : '○'}
                </div>
                <div className="status-badge-content">
                  <span className="status-badge-label">Confirmed</span>
                  <span className="status-badge-value">
                    {guest.confirmation ? 'Confirmed' : 'Not Confirmed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="guest-details-actions">
          <button
            onClick={() => {
              onEdit(guest)
              onClose()
            }}
            className="edit-button"
          >
            Edit Guest
          </button>
          <button
            onClick={() => {
              onDelete(guest.id)
              onClose()
            }}
            className="delete-button"
          >
            Delete Guest
          </button>
        </div>
      </div>
    </div>
  )
}

