import { createClient } from '@/utils/supabase/client'
import { Guest, calculateFinalGrade } from '@/types/guest'

export async function fetchGuests(): Promise<Guest[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guests:', error)
    throw error
  }

  return (data || []).map((guest) => ({
    id: guest.id,
    name: guest.name,
    category: guest.category,
    groomRating: guest.groom_rating,
    bridesmaidRating: guest.bridesmaid_rating,
    attendancePossibility: guest.attendance_possibility,
    finalGrade: guest.final_grade,
    notes: guest.notes || undefined,
    confirmation: guest.confirmation ?? false,
    inviteSent: guest.invite_sent ?? false,
  }))
}

export async function addGuest(guestData: Omit<Guest, 'id' | 'finalGrade'>): Promise<Guest> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const finalGrade = calculateFinalGrade(guestData)

  const { data, error } = await supabase
    .from('guests')
    .insert({
      user_id: user.id,
      name: guestData.name,
      category: guestData.category,
      groom_rating: guestData.groomRating,
      bridesmaid_rating: guestData.bridesmaidRating,
      attendance_possibility: guestData.attendancePossibility,
      final_grade: finalGrade,
      notes: guestData.notes || null,
      confirmation: guestData.confirmation ?? false,
      invite_sent: guestData.inviteSent ?? false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding guest:', error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    groomRating: data.groom_rating,
    bridesmaidRating: data.bridesmaid_rating,
    attendancePossibility: data.attendance_possibility,
    finalGrade: data.final_grade,
    notes: data.notes || undefined,
    confirmation: data.confirmation ?? false,
    inviteSent: data.invite_sent ?? false,
  }
}

export async function updateGuest(id: string, guestData: Omit<Guest, 'id' | 'finalGrade'>): Promise<Guest> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const finalGrade = calculateFinalGrade(guestData)

  const { data, error } = await supabase
    .from('guests')
    .update({
      name: guestData.name,
      category: guestData.category,
      groom_rating: guestData.groomRating,
      bridesmaid_rating: guestData.bridesmaidRating,
      attendance_possibility: guestData.attendancePossibility,
      final_grade: finalGrade,
      notes: guestData.notes || null,
      confirmation: guestData.confirmation ?? false,
      invite_sent: guestData.inviteSent ?? false,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating guest:', error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    groomRating: data.groom_rating,
    bridesmaidRating: data.bridesmaid_rating,
    attendancePossibility: data.attendance_possibility,
    finalGrade: data.final_grade,
    notes: data.notes || undefined,
    confirmation: data.confirmation ?? false,
    inviteSent: data.invite_sent ?? false,
  }
}

export async function toggleGuestConfirmation(id: string, confirmation: boolean): Promise<Guest> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('guests')
    .update({ confirmation })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling confirmation:', error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    groomRating: data.groom_rating,
    bridesmaidRating: data.bridesmaid_rating,
    attendancePossibility: data.attendance_possibility,
    finalGrade: data.final_grade,
    notes: data.notes || undefined,
    confirmation: data.confirmation ?? false,
    inviteSent: data.invite_sent ?? false,
  }
}

export async function toggleGuestInviteSent(id: string, inviteSent: boolean): Promise<Guest> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('guests')
    .update({ invite_sent: inviteSent })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling invite sent:', error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    groomRating: data.groom_rating,
    bridesmaidRating: data.bridesmaid_rating,
    attendancePossibility: data.attendance_possibility,
    finalGrade: data.final_grade,
    notes: data.notes || undefined,
    confirmation: data.confirmation ?? false,
    inviteSent: data.invite_sent ?? false,
  }
}

export async function deleteGuest(id: string): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting guest:', error)
    throw error
  }
}

