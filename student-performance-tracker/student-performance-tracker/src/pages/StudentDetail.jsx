import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AttendanceCalendar from '../components/AttendanceCalendar'
import GlassCard from '../components/GlassCard'
import { useStudents } from '../data/StudentContext'
import {
  formatDate,
  getAttendancePct,
  getAvgMarks,
  getMarksOnDate,
  initials,
  lastNDays,
  scoreBadge,
  shortDayLabel,
} from '../data/helpers'

export default function StudentDetail() {
  const { id } = useParams()
  const { students, deleteRecord } = useStudents()
  const student = students.find((s) => s.id === id)

  // Student not found (e.g. deleted)
  if (!student) {
    return (
      <GlassCard className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-bold text-white">Student not found</h1>
        <p className="mt-2 text-cyan-200">This student may have been deleted.</p>
        <Link to="/students" className="btn-ocean mt-5">
          <ArrowLeft size={16} /> Back to students
        </Link>
      </GlassCard>
    )
  }

  const attendance = getAttendancePct(student)
  const avgMarks = getAvgMarks(student)

  // 7-day marks series for the line graph
  const weekData = lastNDays(7).map((iso) => ({
    day: shortDayLabel(iso),
    marks: getMarksOnDate(student, iso),
  }))

  // Latest 8 records, newest first
  const recent = [...student.records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
        <ArrowLeft size={16} /> Back to students
      </Link>

      {/* Profile header */}
      <GlassCard className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-2xl font-bold text-slate-950 shadow-lg">
          {initials(student.name)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{student.name}</h1>
          <p className="mt-1 text-cyan-200">
            Roll No {student.rollNo} · {student.department} Department
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2">
            <p className="text-lg font-bold text-white">{attendance}%</p>
            <p className="text-xs text-cyan-200">Attendance</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2">
            <p className="text-lg font-bold text-white">{avgMarks}</p>
            <p className="text-xs text-cyan-200">Avg Marks</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2">
            <p className="text-lg font-bold text-white">{student.records.length}</p>
            <p className="text-xs text-cyan-200">Records</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 7-day marks graph */}
        <GlassCard className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Last 7 Days — Marks</h2>
          <p className="mb-4 text-sm text-cyan-200">Days without a record are skipped</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: '#a5f3fc', fontSize: 12 }} stroke="rgba(255,255,255,0.3)" />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#a5f3fc', fontSize: 12 }}
                  stroke="rgba(255,255,255,0.3)"
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#a5f3fc' }}
                />
                <Line
                  type="monotone"
                  dataKey="marks"
                  name="Marks"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22d3ee' }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Attendance calendar */}
        <GlassCard className="p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Attendance Calendar</h2>
          <AttendanceCalendar records={student.records} />
        </GlassCard>
      </div>

      {/* Recent records */}
      <GlassCard className="overflow-hidden">
        <h2 className="px-5 pt-5 text-lg font-semibold text-white sm:px-6">Recent Records</h2>
        <div className="overflow-x-auto">
          <table className="mt-3 w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-white/20 bg-white/5 text-cyan-200">
              <tr>
                <th className="px-5 py-3 font-semibold sm:px-6">Date</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Marks</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-white/10 last:border-0">
                  <td className="px-5 py-3 text-white sm:px-6">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-cyan-100">{r.subject}</td>
                  <td className="px-4 py-3">
                    {r.marks === null ? (
                      <span className="text-cyan-200/60">—</span>
                    ) : (
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreBadge(r.marks)}`}>
                        {r.marks}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-cyan-100">{r.attendance}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => window.confirm('Delete this record?') && deleteRecord(student.id, r.id)}
                      className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-400/20"
                      aria-label="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recent.length === 0 && (
          <p className="px-5 py-8 text-center text-cyan-200">No records yet.</p>
        )}
      </GlassCard>
    </div>
  )
}
