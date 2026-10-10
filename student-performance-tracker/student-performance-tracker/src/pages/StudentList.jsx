import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, RotateCcw, Search, Trash2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useStudents } from '../data/StudentContext'
import { DEPARTMENTS } from '../data/students'
import { getAttendancePct, getAvgMarks, scoreBadge } from '../data/helpers'

export default function StudentList() {
  const { students, deleteStudent, resetData } = useStudents()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')

  // Filter by search text (name or roll no) and by department
  const filtered = students.filter((s) => {
    const text = query.trim().toLowerCase()
    const matchesText =
      !text || s.name.toLowerCase().includes(text) || s.rollNo.toLowerCase().includes(text)
    const matchesDept = department === 'All' || s.department === department
    return matchesText && matchesDept
  })

  const handleDelete = (e, student) => {
    e.stopPropagation() // don't open the detail page
    if (window.confirm(`Delete ${student.name} and all their records?`)) {
      deleteStudent(student.id)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all data back to the demo students?')) resetData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Students</h1>
          <p className="mt-1 text-cyan-200">
            {filtered.length} of {students.length} students
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-white/20 hover:text-white"
        >
          <RotateCcw size={15} /> Reset demo data
        </button>
      </div>

      {/* Search + department filter */}
      <GlassCard className="flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or roll no..."
            className="input-ocean pl-10"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="input-ocean sm:w-48"
          aria-label="Filter by department"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-white/20 bg-white/5 text-cyan-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Roll No</th>
                <th className="px-4 py-3 font-semibold">Attendance %</th>
                <th className="px-4 py-3 font-semibold">Avg Marks</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const attendance = getAttendancePct(s)
                const marks = getAvgMarks(s)
                return (
                  <tr
                    key={s.id}
                    tabIndex={0}
                    onClick={() => navigate(`/students/${s.id}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/students/${s.id}`)}
                    className="cursor-pointer border-b border-white/10 transition last:border-0 hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{s.name}</p>
                      <p className="text-xs text-cyan-200/70">{s.department}</p>
                    </td>
                    <td className="px-4 py-3 text-cyan-100">{s.rollNo}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreBadge(attendance)}`}>
                        {attendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreBadge(marks)}`}>
                        {marks}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, s)}
                          className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-400/20"
                          aria-label={`Delete ${s.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={18} className="text-cyan-200/70" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-cyan-200">No students match your search.</p>
        )}
      </GlassCard>
    </div>
  )
}
