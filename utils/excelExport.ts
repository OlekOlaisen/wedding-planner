import * as XLSX from 'xlsx-js-style'
import { Guest, GuestCategory } from '@/types/guest'

const getGradeColor = (grade: Guest['finalGrade']): string => {
  switch (grade) {
    case 'A':
      return '#10b981'
    case 'B':
      return '#3b82f6'
    case 'C':
      return '#f59e0b'
    case 'D':
      return '#ef4444'
    case 'F':
      return '#991b1b'
    default:
      return '#6b7280'
  }
}

const getCategoryColor = (category: GuestCategory): string => {
  const colors: Record<GuestCategory, string> = {
    'Close Family': '#ec4899',
    'Groom\'s Family': '#3b82f6',
    'Bride\'s Family': '#ef4444',
    'Close Friends': '#10b981',
    'Friends': '#06b6d4',
    'Colleagues': '#f59e0b',
    'Out of Town': '#8b5cf6',
    'Significant Other': '#f97316',
    'Vendors': '#6366f1',
    'Other': '#6b7280',
  }
  return colors[category] || '#6b7280'
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 107, g: 114, b: 128 }
}

export function exportToExcel(guests: Guest[]) {
  const worksheetData = guests.map((guest) => ({
    Name: guest.name,
    Category: guest.category,
    'Groom Rating': guest.groomRating,
    'Bridesmaid Rating': guest.bridesmaidRating,
    'Attendance Possibility': guest.attendancePossibility,
    'Final Grade': guest.finalGrade,
    'Invite Sent': guest.inviteSent ? 'Yes' : 'No',
    'Confirmed': guest.confirmation ? 'Yes' : 'No',
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
    { wch: 12 },
    { wch: 12 },
    { wch: 40 },
  ]
  worksheet['!cols'] = columnWidths

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '374151' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  }

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = headerStyle
  }

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const guest = guests[row - 1]
    if (!guest) continue

    const categoryCol = 1
    const gradeCol = 5
    const inviteSentCol = 6
    const confirmedCol = 7

    const categoryCell = XLSX.utils.encode_cell({ r: row, c: categoryCol })
    const categoryColor = getCategoryColor(guest.category)
    
    if (worksheet[categoryCell]) {
      worksheet[categoryCell].s = {
        fill: {
          fgColor: { rgb: categoryColor.replace('#', '') },
        },
        font: { color: { rgb: 'FFFFFF' }, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
    }

    const gradeCell = XLSX.utils.encode_cell({ r: row, c: gradeCol })
    const gradeColor = getGradeColor(guest.finalGrade)
    
    if (worksheet[gradeCell]) {
      worksheet[gradeCell].s = {
        fill: {
          fgColor: { rgb: gradeColor.replace('#', '') },
        },
        font: { color: { rgb: 'FFFFFF' }, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
    }

    const inviteSentCell = XLSX.utils.encode_cell({ r: row, c: inviteSentCol })
    if (worksheet[inviteSentCell]) {
      worksheet[inviteSentCell].s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { color: { rgb: guest.inviteSent ? '10b981' : '6b7280' }, bold: guest.inviteSent },
      }
    }

    const confirmedCell = XLSX.utils.encode_cell({ r: row, c: confirmedCol })
    if (worksheet[confirmedCell]) {
      worksheet[confirmedCell].s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { color: { rgb: guest.confirmation ? '10b981' : '6b7280' }, bold: guest.confirmation },
      }
    }
  }

  const fileName = `wedding-guest-list-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

