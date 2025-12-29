'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Guest } from '@/types/guest'
import GuestForm from '@/components/GuestForm'
import GuestList from '@/components/GuestList'
import Statistics from '@/components/Statistics'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import { exportToExcel } from '@/utils/excelExport'
import { createClient } from '@/utils/supabase/client'
import { fetchGuests, addGuest, updateGuest, deleteGuest } from '@/utils/database'

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadGuests = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedGuests = await fetchGuests()
      setGuests(loadedGuests)
    } catch (err) {
      console.error('Failed to load guests:', err)
      setError('Failed to load guests. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
        await loadGuests()
      }
    }
    initialize()
  }, [supabase, loadGuests])

  const handleAddGuest = useCallback(async (guestData: Omit<Guest, 'id' | 'finalGrade'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const newGuest = await addGuest(guestData)
      setGuests((prev) => [...prev, newGuest])
    } catch (err) {
      console.error('Failed to add guest:', err)
      setError('Failed to add guest. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleUpdateGuest = useCallback(async (id: string, guestData: Omit<Guest, 'id' | 'finalGrade'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedGuest = await updateGuest(id, guestData)
      setGuests((prev) =>
        prev.map((guest) => (guest.id === id ? updatedGuest : guest))
      )
      setEditingGuest(null)
    } catch (err) {
      console.error('Failed to update guest:', err)
      setError('Failed to update guest. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDeleteGuest = useCallback((id: string) => {
    const guest = guests.find((g) => g.id === id)
    if (guest) {
      setDeleteConfirm({ id, name: guest.name })
    }
  }, [guests])

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm) return
    
    try {
      setIsLoading(true)
      setError(null)
      await deleteGuest(deleteConfirm.id)
      setGuests((prev) => prev.filter((guest) => guest.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Failed to delete guest:', err)
      setError('Failed to delete guest. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [deleteConfirm])

  const cancelDelete = useCallback(() => {
    setDeleteConfirm(null)
  }, [])

  const handleEditGuest = useCallback((guest: Guest) => {
    setEditingGuest(guest)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingGuest(null)
  }, [])

  const handleExport = useCallback(() => {
    exportToExcel(guests)
  }, [guests])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }, [supabase, router])

  return (
    <main className="container">
      <div className="header">
        <h1>Wedding Guest List Planner</h1>
        <p className="subtitle">Manage your guest list with ratings and grades</p>
        <div className="header-actions">
          {userEmail && <span className="user-email">{userEmail}</span>}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '16px', 
          margin: '20px', 
          background: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ 
              marginLeft: '12px', 
              background: 'none', 
              border: 'none', 
              color: '#dc2626', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading && !isLoaded && (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#6b7280' 
        }}>
          Loading guests...
        </div>
      )}

      <div className="content">
        <div className="form-section">
          <GuestForm
            onSubmit={editingGuest ? (data) => handleUpdateGuest(editingGuest.id, data) : handleAddGuest}
            initialData={editingGuest}
            onCancel={editingGuest ? handleCancelEdit : undefined}
          />
          {guests.length > 0 && <Statistics guests={guests} />}
        </div>

        <div className="list-section">
          <div className="list-header">
            <h2>Guest List ({guests.length})</h2>
            {guests.length > 0 && (
              <button onClick={handleExport} className="export-button">
                Export to Excel
              </button>
            )}
          </div>
          <GuestList
            guests={guests}
            onEdit={handleEditGuest}
            onDelete={handleDeleteGuest}
          />
        </div>
      </div>

      {deleteConfirm && (
        <DeleteConfirmModal
          guestName={deleteConfirm.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </main>
  )
}

