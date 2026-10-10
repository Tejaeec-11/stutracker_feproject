import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, Save } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useStudents } from '../data/StudentContext'
import { DEPARTMENTS, SUBJECTS } from '../data/students'
import { todayISO } from '../data/helpers'

export default function AddPerformance() {
  const { students, addRecord } = useStudents()

  const [form, setForm] = useState({
    name: '',
    department: DEPARTMENTS[0], // only used when creating a brand-new student
    date: todayISO(),
    subject: SUBJECTS[0],
    marks: '',
    attendance: 'present',
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(null) // { id, name } after a successful save

  // Update one field
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  // Does the typed name match an existing student?
  const typedName = form.name.trim()
  const match = students.find((s) => s.name.toLowerCase() === typedName.toLowerCase())
  const isNewStudent = typedName !== '' && !match

  // Simple validation, returns an errors object
  const validate = () => {
    const e = {}
    if (!typedName) e.name = 'Student name is required'
    if (!form.date) e.date = 'Pick a date'
    else if (form.date > todayISO()) e.date = 'Date cannot be in the future'
    if (form.attendance === 'present') {
      const marks = Number(form.marks)
      if (form.marks === '' || Number.isNaN(marks)) e.marks = 'Enter the marks'
      else if (marks < 0 || marks > 100) e.marks = 'Marks must be between 0 and 100'
    }
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const id = addRecord({ ...form, name: typedName })
    setSaved({ id, name: match ? match.name : typedName })
    setForm((prev) => ({ ...prev, marks: '' })) // ready for the next entry
  }

  const errorText = (field) =>
    errors[field] && <p className="mt-1 text-xs text-rose-300">{errors[field]}</p>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Add Performance</h1>
        <p className="mt-1 text-cyan-200">Log today&apos;s marks and attendance for a student</p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-400/20 px-4 py-3 text-emerald-100">
          <CircleCheck size={20} />
          <span className="flex-1">Performance saved for {saved.name}.</span>
          <Link to={`/students/${saved.id}`} className="font-semibold underline underline-offset-2">
            View profile
          </Link>
        </div>
      )}

      <GlassCard className="p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
          {/* Student name (type or pick an existing one) */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-cyan-200">
              Student Name
            </label>
            <input
              id="name"
              type="text"
              list="student-names"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Start typing a name..."
              className="input-ocean"
              autoComplete="off"
            />
            <datalist id="student-names">
              {students.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            {errorText('name')}
          </div>

          {/* Department – only for a student who doesn't exist yet */}
          {isNewStudent && (
            <div className="sm:col-span-2">
              <label htmlFor="department" className="mb-1.5 block text-sm font-medium text-cyan-200">
                Department <span className="text-cyan-200/60">(new student will be created)</span>
              </label>
              <select
                id="department"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                className="input-ocean"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-cyan-200">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              max={todayISO()}
              onChange={(e) => update('date', e.target.value)}
              className="input-ocean"
            />
            {errorText('date')}
          </div>

          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-cyan-200">
              Subject
            </label>
            <select
              id="subject"
              value={form.subject}
              onChange={(e) => update('subject', e.target.value)}
              className="input-ocean"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance toggle */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-cyan-200">Attendance</span>
            <div className="grid grid-cols-2 gap-2">
              {['present', 'absent'].map((option) => {
                const active = form.attendance === option
                const activeColor =
                  option === 'present'
                    ? 'border-emerald-300/60 bg-emerald-400/30 text-emerald-100'
                    : 'border-rose-300/60 bg-rose-400/30 text-rose-100'
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update('attendance', option)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition ${
                      active
                        ? activeColor
                        : 'border-white/20 bg-white/10 text-cyan-200 hover:bg-white/20'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Marks (disabled when absent) */}
          <div>
            <label htmlFor="marks" className="mb-1.5 block text-sm font-medium text-cyan-200">
              Marks (0–100)
            </label>
            <input
              id="marks"
              type="number"
              min="0"
              max="100"
              value={form.attendance === 'absent' ? '' : form.marks}
              onChange={(e) => update('marks', e.target.value)}
              disabled={form.attendance === 'absent'}
              placeholder={form.attendance === 'absent' ? 'Not needed' : 'e.g. 85'}
              className="input-ocean"
            />
            {errorText('marks')}
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="btn-ocean w-full sm:w-auto">
              <Save size={18} /> Save Performance
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
