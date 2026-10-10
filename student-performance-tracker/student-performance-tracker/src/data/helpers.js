// Small date + statistics helpers shared by all pages.
// NOTE: dates are handled as local "YYYY-MM-DD" strings (never toISOString,
// which converts to UTC and can shift the day).

/** Format a Date as a local YYYY-MM-DD string */
export const toISODate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse a YYYY-MM-DD string back into a local Date */
export const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => toISODate(new Date())

/** Last n days (oldest -> newest), including today */
export const lastNDays = (n) => {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(toISODate(d))
  }
  return days
}

/** Short chart label, e.g. "Sat 10" */
export const shortDayLabel = (iso) =>
  parseISO(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })

/** Friendly table date, e.g. "10 Oct 2026" */
export const formatDate = (iso) =>
  parseISO(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const average = (nums) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null

/** Attendance % = present records / all records */
export const getAttendancePct = (student) => {
  if (!student.records.length) return 0
  const present = student.records.filter((r) => r.attendance === 'present').length
  return Math.round((present / student.records.length) * 100)
}

/** Average marks (absent days have null marks and are ignored) */
export const getAvgMarks = (student) => {
  const avg = average(
    student.records.filter((r) => r.marks !== null).map((r) => r.marks),
  )
  return avg === null ? 0 : Math.round(avg)
}

/** Average marks for one student on one day (null if nothing recorded) */
export const getMarksOnDate = (student, iso) => {
  const avg = average(
    student.records
      .filter((r) => r.date === iso && r.marks !== null)
      .map((r) => r.marks),
  )
  return avg === null ? null : Math.round(avg)
}

/** Class-wide marks + attendance for each of the last 7 days (dashboard chart) */
export const getWeeklySeries = (students) =>
  lastNDays(7).map((iso) => {
    const dayRecords = students.flatMap((s) => s.records.filter((r) => r.date === iso))
    const marks = average(dayRecords.filter((r) => r.marks !== null).map((r) => r.marks))
    const present = dayRecords.filter((r) => r.attendance === 'present').length
    return {
      day: shortDayLabel(iso),
      marks: marks === null ? null : Math.round(marks),
      attendance: dayRecords.length ? Math.round((present / dayRecords.length) * 100) : null,
    }
  })

/** Student with the highest average marks */
export const getTopPerformer = (students) =>
  students.reduce(
    (best, s) => (!best || getAvgMarks(s) > getAvgMarks(best) ? s : best),
    null,
  )

/** Pending review = student with no entry logged for today */
export const getPendingReviews = (students) => {
  const today = todayISO()
  return students.filter((s) => !s.records.some((r) => r.date === today))
}

/** Badge colour classes for a percentage-like value */
export const scoreBadge = (value) => {
  if (value >= 85) return 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40'
  if (value >= 70) return 'bg-amber-400/20 text-amber-200 border-amber-300/40'
  return 'bg-rose-400/20 text-rose-200 border-rose-300/40'
}

/** "Aarav Sharma" -> "AS" */
export const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
