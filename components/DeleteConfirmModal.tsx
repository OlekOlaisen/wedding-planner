'use client'

interface DeleteConfirmModalProps {
  guestName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ guestName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{guestName}</strong> from the guest list?</p>
        <p className="modal-warning">This action cannot be undone.</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

