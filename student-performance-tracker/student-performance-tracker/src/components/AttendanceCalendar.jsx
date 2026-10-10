import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toISODate, todayISO } from '../data/helpers'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Month calendar: green = present, red = absent, faint = no record.
export default function AttendanceCalendar({ records }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // date -> 'present' | 'absent' (any absence on a day marks it absent)
  const statusByDate = {}
  records.forEach((r) => {
    if (statusByDate[r.date] !== 'absent') statusByDate[r.date] = r.attendance
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay() // blank cells before day 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = todayISO()

  // Build cells: leading blanks + one cell per day
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISODate(new Date(year, month, i + 1))),
  ]

  // Month summary
  const monthPrefix = toISODate(cursor).slice(0, 7)
  const monthDays = Object.entries(statusByDate).filter(([date]) => date.startsWith(monthPrefix))
  const presentCount = monthDays.filter(([, s]) => s === 'present').length
  const absentCount = monthDays.filter(([, s]) => s === 'absent').length

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const cellClass = (iso) => {
    const status = statusByDate[iso]
    const base = 'flex aspect-square items-center justify-center rounded-lg border text-xs font-medium sm:text-sm'
    const color =
      status === 'present'
        ? 'border-emerald-300/50 bg-emerald-400/30 text-emerald-100'
        : status === 'absent'
          ? 'border-rose-300/50 bg-rose-400/30 text-rose-100'
          : 'border-white/10 bg-white/5 text-cyan-200/60'
    const ring = iso === today ? 'ring-2 ring-cyan-300' : ''
    return `${base} ${color} ${ring}`
  }

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded-lg border border-white/20 bg-white/10 p-2 text-cyan-200 transition hover:bg-white/20"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-semibold text-white">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          disabled={isCurrentMonth}
          className="rounded-lg border border-white/20 bg-white/10 p-2 text-cyan-200 transition hover:bg-white/20 disabled:opacity-30"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-cyan-200 sm:gap-2">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((iso, i) =>
          iso ? (
            <div
              key={iso}
              className={cellClass(iso)}
              title={`${iso}: ${statusByDate[iso] ?? 'no record'}`}
            >
              {Number(iso.slice(8))}
            </div>
          ) : (
            <div key={`blank-${i}`} />
          ),
        )}
      </div>

      {/* Legend + month summary */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cyan-200">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-400/60" /> Present ({presentCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-400/60" /> Absent ({absentCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-white/20 bg-white/10" /> No record
        </span>
      </div>
    </div>
  )
}
