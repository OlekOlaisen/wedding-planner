'use client'

import { useState, useEffect } from 'react'
import { Guest, GUEST_CATEGORIES } from '@/types/guest'

interface GuestFormProps {
  onSubmit: (data: Omit<Guest, 'id' | 'finalGrade'>) => void
  initialData?: Guest | null
  onCancel?: () => void
}

export default function GuestForm({ onSubmit, initialData, onCancel }: GuestFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Guest['category']>('Friends')
  const [groomRating, setGroomRating] = useState(5)
  const [bridesmaidRating, setBridesmaidRating] = useState(5)
  const [attendancePossibility, setAttendancePossibility] = useState(5)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCategory(initialData.category)
      setGroomRating(initialData.groomRating)
      setBridesmaidRating(initialData.bridesmaidRating)
      setAttendancePossibility(initialData.attendancePossibility)
      setNotes(initialData.notes || '')
    } else {
      setName('')
      setCategory('Friends')
      setGroomRating(5)
      setBridesmaidRating(5)
      setAttendancePossibility(5)
      setNotes('')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      category,
      groomRating,
      bridesmaidRating,
      attendancePossibility,
      notes: notes.trim() || undefined,
    })

    if (!initialData) {
      setName('')
      setCategory('Friends')
      setGroomRating(5)
      setBridesmaidRating(5)
      setAttendancePossibility(5)
      setNotes('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="guest-form">
      <h2>{initialData ? 'Edit Guest' : 'Add New Guest'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter guest name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Guest['category'])}
          className="category-select"
        >
          {GUEST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="groomRating">
          Groom Rating: {groomRating}/10
        </label>
        <input
          id="groomRating"
          type="range"
          min="1"
          max="10"
          value={groomRating}
          onChange={(e) => setGroomRating(Number(e.target.value))}
        />
        <div className="rating-labels">
          <span>1 (Not Important)</span>
          <span>10 (Very Important)</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bridesmaidRating">
          Bridesmaid Rating: {bridesmaidRating}/10
        </label>
        <input
          id="bridesmaidRating"
          type="range"
          min="1"
          max="10"
          value={bridesmaidRating}
          onChange={(e) => setBridesmaidRating(Number(e.target.value))}
        />
        <div className="rating-labels">
          <span>1 (Not Important)</span>
          <span>10 (Very Important)</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="attendancePossibility">
          Attendance Possibility: {attendancePossibility}/10
        </label>
        <input
          id="attendancePossibility"
          type="range"
          min="1"
          max="10"
          value={attendancePossibility}
          onChange={(e) => setAttendancePossibility(Number(e.target.value))}
        />
        <div className="rating-labels">
          <span>1 (Unlikely)</span>
          <span>10 (Very Likely)</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes about this guest..."
          rows={3}
          className="notes-textarea"
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
        <button type="submit" className="submit-button">
          {initialData ? 'Update Guest' : 'Add Guest'}
        </button>
      </div>
    </form>
  )
}

