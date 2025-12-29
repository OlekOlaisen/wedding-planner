# Wedding Planner - Guest List Manager

A beautiful and clean Next.js application for managing your wedding guest list with ratings and grades.

## Features

- **Add Guests**: Add guests to your wedding list with their information
- **Rating System**: 
  - Groom rating (1-10): How much the groom wants them there
  - Bridesmaid rating (1-10): How much the bridesmaid wants them there
  - Attendance possibility (1-10): Likelihood of the guest attending
- **Final Grade (A-F)**: Automatically calculated based on ratings
- **Edit & Delete**: Manage your guest list with easy edit and delete functionality
- **Excel Export**: Export your entire guest list to Excel for further analysis

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### Adding a Guest

1. Fill in the guest's name
2. Set the groom rating (1-10 slider)
3. Set the bridesmaid rating (1-10 slider)
4. Set the attendance possibility (1-10 slider)
5. Click "Add Guest"

### Final Grade Calculation

The final grade (A-F) is automatically calculated using a weighted formula:
- 60% weight on average of groom and bridesmaid ratings
- 40% weight on attendance possibility

Grade thresholds:
- **A**: 9.0+
- **B**: 7.5-8.9
- **C**: 6.0-7.4
- **D**: 4.5-5.9
- **F**: Below 4.5

### Exporting to Excel

Click the "Export to Excel" button to download your guest list as an Excel file with all ratings and grades.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **XLSX** - Excel export functionality

## Project Structure

```
wedding-planner/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── GuestForm.tsx    # Form for adding/editing guests
│   └── GuestList.tsx    # Display list of guests
├── types/
│   └── guest.ts         # TypeScript types and grade calculation
└── utils/
    └── excelExport.ts   # Excel export functionality
```

## Build for Production

```bash
npm run build
npm start
```

