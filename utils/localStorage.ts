import { Guest } from '@/types/guest'

const STORAGE_KEY = 'wedding-guest-list'

export function saveGuestsToLocalStorage(guests: Guest[]): void {
  try {
    const serialized = JSON.stringify(guests)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save guests to localStorage:', error)
  }
}

export function loadGuestsFromLocalStorage(): Guest[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return []
    }
    const guests = JSON.parse(serialized) as Guest[]
    return guests
  } catch (error) {
    console.error('Failed to load guests from localStorage:', error)
    return []
  }
}

