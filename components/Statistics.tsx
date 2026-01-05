"use client";

import { useState, useEffect, useRef } from "react";
import { Guest } from "@/types/guest";

interface StatisticsProps {
  guests: Guest[];
}

export default function Statistics({ guests }: StatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };
  if (guests.length === 0) {
    return null;
  }

  const totalGuests = guests.length;

  // Expected attendance based on attendance possibility (using 70% threshold as likely to attend)
  const expectedAttendance = guests.filter(
    (g) => g.attendancePossibility >= 7
  ).length;

  // Confirmed guests
  const confirmedGuests = guests.filter((g) => g.confirmation === true).length;

  // Invites sent
  const invitesSent = guests.filter((g) => g.inviteSent === true).length;

  // Confirmation rate (percentage of invites sent that have been confirmed)
  const confirmationRate =
    invitesSent > 0 ? (confirmedGuests / invitesSent) * 100 : 0;

  // Response rate (percentage of total guests that have been sent invites)
  const responseRate = (invitesSent / totalGuests) * 100;

  // High priority guests - high combined rating but low attendance possibility (need follow-up)
  const highPriorityGuests = guests.filter((g) => {
    const averageRating = (g.groomRating + g.bridesmaidRating) / 2;
    return averageRating >= 7 && g.attendancePossibility < 5;
  });

  // Category breakdown
  const categoryDistribution = guests.reduce((acc, guest) => {
    acc[guest.category] = (acc[guest.category] || 0) + 1;
    return acc;
  }, {} as Record<Guest["category"], number>);

  const gradeDistribution = guests.reduce((acc, guest) => {
    acc[guest.finalGrade] = (acc[guest.finalGrade] || 0) + 1;
    return acc;
  }, {} as Record<Guest["finalGrade"], number>);

  // Pending confirmations - guests who have been sent invites but haven't confirmed
  const pendingConfirmations = guests.filter(
    (g) => g.inviteSent === true && g.confirmation === false
  );

  return (
    <div className="statistics-panel">
      <div className="statistics-header-desktop">
        <h3>Statistics</h3>
      </div>
      <button
        className="statistics-header-mobile"
        onClick={toggleExpanded}
        {...(isExpanded
          ? { "aria-expanded": "true" }
          : { "aria-expanded": "false" })}
      >
        <h3>Statistics</h3>
        <span className="accordion-icon">{isExpanded ? "−" : "+"}</span>
      </button>
      <div className={`statistics-content ${isExpanded ? "open" : ""}`}>
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
            <div className="stat-value">{confirmedGuests}</div>
            <div className="stat-label">Confirmed Guests</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{confirmationRate.toFixed(0)}%</div>
            <div className="stat-label">Confirmation Rate</div>
            <div className="stat-sublabel">
              ({confirmedGuests}/{invitesSent || "—"})
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">
              {invitesSent}/{totalGuests}
            </div>
            <div className="stat-label">Invites Sent</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{responseRate.toFixed(0)}%</div>
            <div className="stat-label">Response Rate</div>
            <div className="stat-sublabel">(Invites sent)</div>
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
                    <CategoryBarFill
                      width={`${(count / totalGuests) * 100}%`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>Grade Distribution</h4>
          <div className="grade-stats">
            {(["A", "B", "C", "D", "F"] as const).map((grade) => {
              const count = gradeDistribution[grade] || 0;
              const percentage =
                totalGuests > 0 ? (count / totalGuests) * 100 : 0;
              const gradeColor = getGradeColor(grade);
              return (
                <div key={grade} className="grade-stat-item">
                  <div className="grade-stat-header">
                    <span className="grade-stat-label">{grade}:</span>
                    <span className="grade-stat-value">{count}</span>
                    <span className="grade-stat-percentage">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="grade-stat-bar">
                    <GradeBarFill width={`${percentage}%`} color={gradeColor} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {highPriorityGuests.length > 0 && (
          <div className="stats-section">
            <h4>High Priority Follow-ups ({highPriorityGuests.length})</h4>
            <p className="high-priority-description">
              High-rated guests with low attendance possibility - may need
              follow-up
            </p>
            <div className="top-guests">
              {highPriorityGuests
                .sort((a, b) => {
                  const avgA = (a.groomRating + a.bridesmaidRating) / 2;
                  const avgB = (b.groomRating + b.bridesmaidRating) / 2;
                  return avgB - avgA;
                })
                .map((guest) => (
                  <div key={guest.id} className="top-guest-item">
                    <span className="name">{guest.name}</span>
                    <span className="guest-rating-info">
                      Rating:{" "}
                      {(
                        (guest.groomRating + guest.bridesmaidRating) /
                        2
                      ).toFixed(1)}{" "}
                      | Attendance: {guest.attendancePossibility}/10
                    </span>
                    <CategoryBadgeSmall
                      color={getCategoryColor(guest.category)}
                      category={guest.category}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="stats-section">
          <h4>Pending Confirmations ({pendingConfirmations.length})</h4>
          {pendingConfirmations.length > 0 ? (
            <div className="top-guests">
              {pendingConfirmations.map((guest) => (
                <div key={guest.id} className="top-guest-item">
                  <span className="name">{guest.name}</span>
                  <CategoryBadgeSmall
                    color={getCategoryColor(guest.category)}
                    category={guest.category}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="pending-confirmations-empty">
              No pending confirmations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: Guest["category"]): string {
  const colors: Record<Guest["category"], string> = {
    "Close Family": "#ec4899",
    "Groom's Family": "#3b82f6",
    "Bride's Family": "#ef4444",
    "Close Friends": "#10b981",
    Friends: "#06b6d4",
    Colleagues: "#f59e0b",
    "Out of Town": "#8b5cf6",
    "Significant Other": "#f97316",
    Vendors: "#6366f1",
    Other: "#6b7280",
  };
  return colors[category] || "#6b7280";
}

function getGradeColor(grade: Guest["finalGrade"]): string {
  switch (grade) {
    case "A":
      return "#10b981";
    case "B":
      return "#3b82f6";
    case "C":
      return "#f59e0b";
    case "D":
      return "#ef4444";
    case "F":
      return "#991b1b";
    default:
      return "#6b7280";
  }
}

function CategoryBarFill({ width }: { width: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--category-bar-width", width);
    }
  }, [width]);

  return <div ref={ref} className="category-stat-bar-fill" />;
}

function GradeBarFill({ width, color }: { width: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--grade-bar-width", width);
      ref.current.style.setProperty("--grade-bar-color", color);
    }
  }, [width, color]);

  return <div ref={ref} className="grade-stat-bar-fill" />;
}

function CategoryBadgeSmall({
  color,
  category,
}: {
  color: string;
  category: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--category-badge-color", color);
    }
  }, [color]);

  return (
    <span ref={ref} className="category-badge-small">
      {category}
    </span>
  );
}
