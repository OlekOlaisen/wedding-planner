import { Guest, calculateFinalGrade, GuestCategory } from '@/types/guest'

interface GuestTemplate {
  name: string
  category: GuestCategory
  groomRating: number
  bridesmaidRating: number
  attendancePossibility: number
  notes?: string
}

export function generateSampleGuests(): Guest[] {
  const guestTemplates: GuestTemplate[] = [
    // Bridal Party (6 people) - High ratings, high attendance
    { name: 'Emma Thompson', category: 'Bridal Party', groomRating: 10, bridesmaidRating: 10, attendancePossibility: 10, notes: 'Maid of Honor' },
    { name: 'James Wilson', category: 'Bridal Party', groomRating: 10, bridesmaidRating: 9, attendancePossibility: 10, notes: 'Best Man' },
    { name: 'Sophie Martinez', category: 'Bridal Party', groomRating: 9, bridesmaidRating: 10, attendancePossibility: 10 },
    { name: 'Ryan Anderson', category: 'Bridal Party', groomRating: 10, bridesmaidRating: 8, attendancePossibility: 10 },
    { name: 'Olivia Brown', category: 'Bridal Party', groomRating: 8, bridesmaidRating: 10, attendancePossibility: 9 },
    { name: 'Michael Chen', category: 'Bridal Party', groomRating: 9, bridesmaidRating: 9, attendancePossibility: 10 },
    
    // Groom's Family (8 people) - High ratings from groom, high attendance
    { name: 'Robert Wilson', category: 'Groom\'s Family', groomRating: 10, bridesmaidRating: 8, attendancePossibility: 10, notes: 'Father of the Groom' },
    { name: 'Patricia Wilson', category: 'Groom\'s Family', groomRating: 10, bridesmaidRating: 8, attendancePossibility: 10, notes: 'Mother of the Groom' },
    { name: 'David Wilson', category: 'Groom\'s Family', groomRating: 10, bridesmaidRating: 7, attendancePossibility: 9, notes: 'Brother' },
    { name: 'Jennifer Wilson', category: 'Groom\'s Family', groomRating: 9, bridesmaidRating: 7, attendancePossibility: 9, notes: 'Sister-in-law' },
    { name: 'William Wilson', category: 'Groom\'s Family', groomRating: 9, bridesmaidRating: 6, attendancePossibility: 8, notes: 'Uncle' },
    { name: 'Margaret Wilson', category: 'Groom\'s Family', groomRating: 9, bridesmaidRating: 6, attendancePossibility: 8, notes: 'Aunt' },
    { name: 'Thomas Wilson', category: 'Groom\'s Family', groomRating: 9, bridesmaidRating: 6, attendancePossibility: 8, notes: 'Cousin' },
    { name: 'Elizabeth Wilson', category: 'Groom\'s Family', groomRating: 9, bridesmaidRating: 6, attendancePossibility: 8, notes: 'Cousin' },
    
    // Bride's Family (8 people) - High ratings from bride, high attendance
    { name: 'John Thompson', category: 'Bride\'s Family', groomRating: 8, bridesmaidRating: 10, attendancePossibility: 10, notes: 'Father of the Bride' },
    { name: 'Mary Thompson', category: 'Bride\'s Family', groomRating: 8, bridesmaidRating: 10, attendancePossibility: 10, notes: 'Mother of the Bride' },
    { name: 'Sarah Thompson', category: 'Bride\'s Family', groomRating: 7, bridesmaidRating: 10, attendancePossibility: 9, notes: 'Sister' },
    { name: 'Daniel Thompson', category: 'Bride\'s Family', groomRating: 7, bridesmaidRating: 9, attendancePossibility: 9, notes: 'Brother-in-law' },
    { name: 'Richard Thompson', category: 'Bride\'s Family', groomRating: 6, bridesmaidRating: 8, attendancePossibility: 8, notes: 'Uncle' },
    { name: 'Catherine Thompson', category: 'Bride\'s Family', groomRating: 6, bridesmaidRating: 8, attendancePossibility: 8, notes: 'Aunt' },
    { name: 'Christopher Thompson', category: 'Bride\'s Family', groomRating: 6, bridesmaidRating: 7, attendancePossibility: 8, notes: 'Cousin' },
    { name: 'Amanda Thompson', category: 'Bride\'s Family', groomRating: 6, bridesmaidRating: 7, attendancePossibility: 8, notes: 'Cousin' },
    
    // Close Friends (6 people) - High ratings, medium-high attendance
    { name: 'Alex Johnson', category: 'Close Friends', groomRating: 9, bridesmaidRating: 9, attendancePossibility: 9, notes: 'College roommate' },
    { name: 'Jessica Lee', category: 'Close Friends', groomRating: 8, bridesmaidRating: 9, attendancePossibility: 9 },
    { name: 'Mark Davis', category: 'Close Friends', groomRating: 9, bridesmaidRating: 8, attendancePossibility: 8 },
    { name: 'Lauren Taylor', category: 'Close Friends', groomRating: 8, bridesmaidRating: 9, attendancePossibility: 8 },
    { name: 'Kevin White', category: 'Close Friends', groomRating: 9, bridesmaidRating: 7, attendancePossibility: 8 },
    { name: 'Nicole Garcia', category: 'Close Friends', groomRating: 7, bridesmaidRating: 9, attendancePossibility: 8 },
    
    // Friends (4 people) - Medium ratings, medium attendance
    { name: 'Brian Miller', category: 'Friends', groomRating: 7, bridesmaidRating: 6, attendancePossibility: 7 },
    { name: 'Rachel Green', category: 'Friends', groomRating: 6, bridesmaidRating: 7, attendancePossibility: 7 },
    { name: 'Steven Harris', category: 'Friends', groomRating: 7, bridesmaidRating: 6, attendancePossibility: 6 },
    { name: 'Michelle Clark', category: 'Friends', groomRating: 6, bridesmaidRating: 7, attendancePossibility: 6 },
    
    // Colleagues (3 people) - Lower ratings, lower attendance
    { name: 'Robert Martinez', category: 'Colleagues', groomRating: 5, bridesmaidRating: 4, attendancePossibility: 6, notes: 'Work colleague' },
    { name: 'Lisa Anderson', category: 'Colleagues', groomRating: 4, bridesmaidRating: 5, attendancePossibility: 5, notes: 'Work colleague' },
    { name: 'Paul Jackson', category: 'Colleagues', groomRating: 5, bridesmaidRating: 4, attendancePossibility: 5, notes: 'Work colleague' },
    
    // Out of Town (2 people) - Medium ratings, lower attendance due to travel
    { name: 'Michael O\'Brien', category: 'Out of Town', groomRating: 7, bridesmaidRating: 6, attendancePossibility: 6, notes: 'Traveling from Ireland' },
    { name: 'Emily Foster', category: 'Out of Town', groomRating: 6, bridesmaidRating: 7, attendancePossibility: 5, notes: 'Traveling from California' },
    
    // Significant Other (2 people) - Medium ratings, depends on main guest
    { name: 'Sarah\'s Plus One', category: 'Significant Other', groomRating: 5, bridesmaidRating: 6, attendancePossibility: 7, notes: 'Guest of Sarah Thompson' },
    { name: 'Alex\'s Plus One', category: 'Significant Other', groomRating: 6, bridesmaidRating: 5, attendancePossibility: 7, notes: 'Guest of Alex Johnson' },
    
    // Vendors (1 person) - Lower ratings, high attendance (they have to be there)
    { name: 'Photographer Team', category: 'Vendors', groomRating: 3, bridesmaidRating: 3, attendancePossibility: 10, notes: 'Wedding photographer' },
  ]
  
  const guests: Guest[] = guestTemplates.map((template, index) => {
    const guestData = {
      name: template.name,
      category: template.category,
      groomRating: template.groomRating,
      bridesmaidRating: template.bridesmaidRating,
      attendancePossibility: template.attendancePossibility,
      notes: template.notes,
    }
    
    const finalGrade = calculateFinalGrade(guestData)
    
    return {
      id: `sample-${index}-${Date.now()}`,
      ...guestData,
      finalGrade,
    }
  })
  
  return guests
}


