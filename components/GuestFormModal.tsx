"use client";

import { Guest } from "@/types/guest";
import GuestForm from "./GuestForm";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Guest, "id" | "finalGrade">) => void;
  initialData?: Guest | null;
}

export default function GuestFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: GuestFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (data: Omit<Guest, "id" | "finalGrade">) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content guest-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{initialData ? "Edit Guest" : "Add New Guest"}</h3>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="guest-form-modal-content">
          <GuestForm
            onSubmit={handleSubmit}
            initialData={initialData}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

