import { CalendarCheck, ClipboardList, Trophy, Users } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import { useStudents } from '../data/StudentContext'
import {
  getAttendancePct,
  getAvgMarks,
  getPendingReviews,
  getTopPerformer,
  getWeeklySeries,
} from '../data/helpers'

export default function Dashboard() {
  const { students } = useStudents()

  // ---- Stats ----
  const total = students.length
  const avgAttendance = total
    ? Math.round(students.reduce((sum, s) => sum + getAttendancePct(s), 0) / total)
    : 0
  const top = getTopPerformer(students)
  const pending = getPendingReviews(students)

  // ---- Weekly chart data ----
  const weekly = getWeeklySeries(students)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-cyan-200">Class performance at a glance</p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={total} hint="Enrolled this term" />
        <StatCard
          icon={CalendarCheck}
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          hint="Across all students"
        />
        <StatCard
          icon={Trophy}
          label="Top Performer"
          value={top ? top.name : '—'}
          hint={top ? `Avg marks ${getAvgMarks(top)}%` : 'No data yet'}
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Reviews"
          value={pending.length}
          hint="No entry logged today"
        />
      </div>

      {/* Weekly performance line chart */}
      <GlassCard className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Weekly Performance</h2>
        <p className="mb-4 text-sm text-cyan-200">Class average marks and attendance, last 7 days</p>

        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
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
              <Legend wrapperStyle={{ color: '#a5f3fc', fontSize: 13 }} />
              <Line
                type="monotone"
                dataKey="marks"
                name="Avg Marks"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 4, fill: '#22d3ee' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 4, fill: '#fbbf24' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}
