export type GuestCategory = 
  | 'Close Family'
  | 'Groom\'s Family'
  | 'Bride\'s Family'
  | 'Close Friends'
  | 'Friends'
  | 'Colleagues'
  | 'Out of Town'
  | 'Significant Other'
  | 'Vendors'
  | 'Other';

export const GUEST_CATEGORIES: GuestCategory[] = [
  'Close Family',
  'Groom\'s Family',
  'Bride\'s Family',
  'Close Friends',
  'Friends',
  'Colleagues',
  'Out of Town',
  'Significant Other',
  'Vendors',
  'Other',
];

export interface Guest {
  id: string;
  name: string;
  category: GuestCategory;
  groomRating: number; // 1-10
  bridesmaidRating: number; // 1-10
  attendancePossibility: number; // 1-10 (1 = unlikely, 10 = very likely)
  finalGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  notes?: string;
  confirmation: boolean;
  inviteSent: boolean;
}

export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'grade-asc'
  | 'grade-desc'
  | 'category-asc'
  | 'groom-rating-desc'
  | 'bridesmaid-rating-desc'
  | 'attendance-desc';

export function calculateFinalGrade(guest: Omit<Guest, 'id' | 'finalGrade'>): Guest['finalGrade'] {
  const averageRating = (guest.groomRating + guest.bridesmaidRating) / 2;
  const weightedScore = (averageRating * 0.6) + (guest.attendancePossibility * 0.4);
  
  if (weightedScore >= 9) return 'A';
  if (weightedScore >= 7.5) return 'B';
  if (weightedScore >= 6) return 'C';
  if (weightedScore >= 4.5) return 'D';
  return 'F';
}

