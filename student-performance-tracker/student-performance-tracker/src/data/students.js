// Mock data for 8 students.
// Each student has daily "records": { id, date, subject, marks, attendance }.
// Records are generated for the last 30 days (relative to today) with a seeded
// random generator, so the charts always look fresh but stay deterministic.

import { toISODate } from './helpers'

export const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH']

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Computer Science',
  'Electronics',
]

// Basic info + how well each student tends to do (base marks / attendance chance)
const profiles = [
  { id: 's1', name: 'Aarav Sharma', rollNo: 'CSE101', department: 'CSE', base: 88, attendProb: 0.95 },
  { id: 's2', name: 'Diya Patel', rollNo: 'CSE102', department: 'CSE', base: 76, attendProb: 0.88 },
  { id: 's3', name: 'Rohan Mehta', rollNo: 'ECE101', department: 'ECE', base: 64, attendProb: 0.78 },
  { id: 's4', name: 'Ananya Iyer', rollNo: 'ECE102', department: 'ECE', base: 92, attendProb: 0.97 },
  { id: 's5', name: 'Karthik Raj', rollNo: 'EEE101', department: 'EEE', base: 71, attendProb: 0.85 },
  { id: 's6', name: 'Sneha Reddy', rollNo: 'EEE102', department: 'EEE', base: 58, attendProb: 0.7 },
  { id: 's7', name: 'Vikram Singh', rollNo: 'MECH101', department: 'MECH', base: 82, attendProb: 0.9 },
  { id: 's8', name: 'Meera Nair', rollNo: 'MECH102', department: 'MECH', base: 67, attendProb: 0.8 },
]

// Students (by index) who have NOT been logged yet today -> "Pending Reviews"
const notLoggedToday = [1, 4, 6]

// Tiny seeded random number generator (mulberry32)
function seededRandom(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildRecords(profile, studentIndex) {
  const random = seededRandom(studentIndex + 1)
  const records = []

  for (let offset = 29; offset >= 0; offset--) {
    const date = new Date()
    date.setDate(date.getDate() - offset)

    if (date.getDay() === 0) continue // no classes on Sunday
    if (offset === 0 && notLoggedToday.includes(studentIndex)) continue

    const present = random() < profile.attendProb
    const rawMarks = profile.base + (random() - 0.5) * 24
    const marks = Math.max(20, Math.min(100, Math.round(rawMarks)))

    records.push({
      id: `${profile.id}-${toISODate(date)}`,
      date: toISODate(date),
      subject: SUBJECTS[(offset + studentIndex) % SUBJECTS.length],
      marks: present ? marks : null, // absent = no marks that day
      attendance: present ? 'present' : 'absent',
    })
  }
  return records
}

export const mockStudents = profiles.map((p, i) => ({
  id: p.id,
  name: p.name,
  rollNo: p.rollNo,
  department: p.department,
  records: buildRecords(p, i),
}))
