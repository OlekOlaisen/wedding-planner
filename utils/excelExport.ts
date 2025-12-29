import * as XLSX from 'xlsx'
import { Guest } from '@/types/guest'

export function exportToExcel(guests: Guest[]) {
  const worksheetData = guests.map((guest) => ({
    Name: guest.name,
    Category: guest.category,
    'Groom Rating': guest.groomRating,
    'Bridesmaid Rating': guest.bridesmaidRating,
    'Attendance Possibility': guest.attendancePossibility,
    'Final Grade': guest.finalGrade,
    Notes: guest.notes || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest List')

  const columnWidths = [
    { wch: 25 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 22 },
    { wch: 12 },
    { wch: 40 },
  ]
  worksheet['!cols'] = columnWidths

  const fileName = `wedding-guest-list-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

