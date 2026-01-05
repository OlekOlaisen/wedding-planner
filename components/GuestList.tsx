"use client";

import { useState, useMemo } from "react";
import {
  Guest,
  GUEST_CATEGORIES,
  GuestCategory,
  SortOption,
} from "@/types/guest";
import GuestDetailsModal from "./GuestDetailsModal";
import {
  toggleGuestConfirmation,
  toggleGuestInviteSent,
} from "@/utils/database";

interface GuestListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
  onGuestUpdate?: (guest: Guest) => void;
}

export default function GuestList({
  guests,
  onEdit,
  onDelete,
  onGuestUpdate,
}: GuestListProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    GuestCategory | "All"
  >("All");
  const [confirmationFilter, setConfirmationFilter] = useState<
    "All" | "Confirmed" | "Not Confirmed"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredAndSortedGuests = useMemo(() => {
    let filtered = guests;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (guest) => guest.category === selectedCategory
      );
    }

    if (confirmationFilter !== "All") {
      if (confirmationFilter === "Confirmed") {
        filtered = filtered.filter((guest) => guest.confirmation === true);
      } else {
        filtered = filtered.filter((guest) => guest.confirmation === false);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query) ||
          guest.notes?.toLowerCase().includes(query) ||
          guest.category.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "grade-asc":
          const gradeOrder = { A: 1, B: 2, C: 3, D: 4, F: 5 };
          return gradeOrder[a.finalGrade] - gradeOrder[b.finalGrade];
        case "grade-desc":
          const gradeOrderDesc = { A: 1, B: 2, C: 3, D: 4, F: 5 };
          return gradeOrderDesc[b.finalGrade] - gradeOrderDesc[a.finalGrade];
        case "category-asc":
          return a.category.localeCompare(b.category);
        case "groom-rating-desc":
          return b.groomRating - a.groomRating;
        case "bridesmaid-rating-desc":
          return b.bridesmaidRating - a.bridesmaidRating;
        case "attendance-desc":
          return b.attendancePossibility - a.attendancePossibility;
        default:
          return 0;
      }
    });

    return sorted;
  }, [guests, selectedCategory, confirmationFilter, searchQuery, sortOption]);

  if (guests.length === 0) {
    return (
      <div className="empty-state">
        <p>No guests added yet. Add your first guest to get started!</p>
      </div>
    );
  }

  const getCategoryColorKey = (category: GuestCategory): string => {
    const colorMap: Record<GuestCategory, string> = {
      "Close Family": "close-family",
      "Groom's Family": "grooms-family",
      "Bride's Family": "brides-family",
      "Close Friends": "close-friends",
      Friends: "friends",
      Colleagues: "colleagues",
      "Out of Town": "out-of-town",
      "Significant Other": "significant-other",
      Vendors: "vendors",
      Other: "other",
    };
    return colorMap[category] || "other";
  };

  const handleToggleConfirmation = async (
    guest: Guest,
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const updatedGuest = await toggleGuestConfirmation(
        guest.id,
        !guest.confirmation
      );
      if (onGuestUpdate) {
        onGuestUpdate(updatedGuest);
      }
    } catch (error) {
      console.error("Failed to toggle confirmation:", error);
    }
  };

  const handleToggleInviteSent = async (
    guest: Guest,
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const updatedGuest = await toggleGuestInviteSent(
        guest.id,
        !guest.inviteSent
      );
      if (onGuestUpdate) {
        onGuestUpdate(updatedGuest);
      }
    } catch (error) {
      console.error("Failed to toggle invite sent:", error);
    }
  };

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
              onChange={(e) =>
                setSelectedCategory(e.target.value as GuestCategory | "All")
              }
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
            <label htmlFor="confirmation-filter">Confirmed:</label>
            <select
              id="confirmation-filter"
              value={confirmationFilter}
              onChange={(e) =>
                setConfirmationFilter(
                  e.target.value as "All" | "Confirmed" | "Not Confirmed"
                )
              }
              className="category-filter-select"
            >
              <option value="All">All</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Not Confirmed">Not Confirmed</option>
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
              <option value="bridesmaid-rating-desc">
                Bridesmaid Rating (High-Low)
              </option>
              <option value="attendance-desc">Attendance (High-Low)</option>
            </select>
          </div>
        </div>
        <span className="filter-count">
          Showing {filteredAndSortedGuests.length} of {guests.length} guests
        </span>
      </div>

      {/* Desktop Table View */}
      <table className="guest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Groom Rating</th>
            <th>Bridesmaid Rating</th>
            <th>Attendance Possibility</th>
            <th>Final Grade</th>
            <th>Invite Sent</th>
            <th>Confirmed</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedGuests.map((guest) => (
            <tr
              key={guest.id}
              className="guest-row"
              onClick={() => setSelectedGuest(guest)}
            >
              <td className="name-cell">
                <div>
                  {guest.name}
                  {guest.notes && (
                    <span className="has-notes" title={guest.notes}>
                      📝
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span
                  className="category-badge"
                  data-color={getCategoryColorKey(guest.category)}
                >
                  {guest.category}
                </span>
              </td>
              <td>{guest.groomRating}/10</td>
              <td>{guest.bridesmaidRating}/10</td>
              <td>{guest.attendancePossibility}/10</td>
              <td>
                <span className="grade-badge" data-color={guest.finalGrade}>
                  {guest.finalGrade}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <label className="sr-only" htmlFor={`invite-sent-${guest.id}`}>
                  Invite sent for {guest.name}
                </label>
                <input
                  id={`invite-sent-${guest.id}`}
                  type="checkbox"
                  checked={guest.inviteSent}
                  onChange={(e) => handleToggleInviteSent(guest, e)}
                  aria-label={`Invite sent for ${guest.name}`}
                />
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <label className="sr-only" htmlFor={`confirmed-${guest.id}`}>
                  Confirmed for {guest.name}
                </label>
                <input
                  id={`confirmed-${guest.id}`}
                  type="checkbox"
                  checked={guest.confirmation}
                  onChange={(e) => handleToggleConfirmation(guest, e)}
                  aria-label={`Confirmed for ${guest.name}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="guest-cards">
        {filteredAndSortedGuests.map((guest) => (
          <div
            key={guest.id}
            className="guest-card"
            onClick={() => setSelectedGuest(guest)}
          >
            <div className="guest-card-header">
              <div className="guest-card-name">
                <div>
                  {guest.name}
                  {guest.notes && (
                    <span className="has-notes" title={guest.notes}>
                      📝
                    </span>
                  )}
                </div>
              </div>
              <div className="guest-card-badges">
                <span
                  className="category-badge"
                  data-color={getCategoryColorKey(guest.category)}
                >
                  {guest.category}
                </span>
                <span className="grade-badge" data-color={guest.finalGrade}>
                  {guest.finalGrade}
                </span>
              </div>
            </div>
            <div className="guest-card-body">
              <div className="guest-card-field">
                <span className="guest-card-label">Groom Rating</span>
                <span className="guest-card-value">{guest.groomRating}/10</span>
              </div>
              <div className="guest-card-field">
                <span className="guest-card-label">Bridesmaid Rating</span>
                <span className="guest-card-value">
                  {guest.bridesmaidRating}/10
                </span>
              </div>
              <div className="guest-card-field">
                <span className="guest-card-label">Attendance</span>
                <span className="guest-card-value">
                  {guest.attendancePossibility}/10
                </span>
              </div>
            </div>
            <div
              className="guest-card-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="guest-card-checkboxes">
                <div className="guest-card-checkbox-group">
                  <label htmlFor={`mobile-invite-sent-${guest.id}`}>
                    Invite Sent
                  </label>
                  <input
                    id={`mobile-invite-sent-${guest.id}`}
                    type="checkbox"
                    checked={guest.inviteSent}
                    onChange={(e) => handleToggleInviteSent(guest, e)}
                    aria-label={`Invite sent for ${guest.name}`}
                  />
                </div>
                <div className="guest-card-checkbox-group">
                  <label htmlFor={`mobile-confirmed-${guest.id}`}>
                    Confirmed
                  </label>
                  <input
                    id={`mobile-confirmed-${guest.id}`}
                    type="checkbox"
                    checked={guest.confirmation}
                    onChange={(e) => handleToggleConfirmation(guest, e)}
                    aria-label={`Confirmed for ${guest.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredAndSortedGuests.length === 0 &&
        (selectedCategory !== "All" || searchQuery.trim()) && (
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
  );
}
