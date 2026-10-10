// Global student store. All data lives in React state and is mirrored to
// localStorage, so add / delete actions survive a page refresh (no backend).

import { createContext, useContext, useEffect, useState } from 'react'
import { mockStudents } from './students'

const STORAGE_KEY = 'sdpts_students_v1'
const StudentContext = createContext(null)

// Read saved data from localStorage, or fall back to the mock data
function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // corrupt / unavailable storage -> use mock data
  }
  return mockStudents
}

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(loadStudents)

  // Save to localStorage whenever students change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    } catch {
      // storage full / blocked -> ignore
    }
  }, [students])

  /**
   * Add a performance record. If the name doesn't match an existing student,
   * a new student is created in the chosen department.
   * Returns the student's id.
   */
  const addRecord = ({ name, department, date, subject, marks, attendance }) => {
    const trimmed = name.trim()
    const existing = students.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    const studentId = existing ? existing.id : `s-${Date.now()}`

    const record = {
      id: `r-${Date.now()}`,
      date,
      subject,
      marks: attendance === 'present' ? Number(marks) : null,
      attendance,
    }

    setStudents((prev) => {
      if (existing) {
        return prev.map((s) =>
          s.id === studentId ? { ...s, records: [...s.records, record] } : s,
        )
      }
      // New student: pick the next free roll number, e.g. CSE103
      const used = new Set(prev.map((s) => s.rollNo))
      let n = 101
      while (used.has(`${department}${n}`)) n++
      return [
        ...prev,
        { id: studentId, name: trimmed, rollNo: `${department}${n}`, department, records: [record] },
      ]
    })

    return studentId
  }

  const deleteStudent = (id) => setStudents((prev) => prev.filter((s) => s.id !== id))

  const deleteRecord = (studentId, recordId) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, records: s.records.filter((r) => r.id !== recordId) } : s,
      ),
    )

  // Restore the demo data (fresh dates, relative to today)
  const resetData = () => setStudents(mockStudents)

  return (
    <StudentContext.Provider
      value={{ students, addRecord, deleteStudent, deleteRecord, resetData }}
    >
      {children}
    </StudentContext.Provider>
  )
}

// Hook used by the pages: const { students } = useStudents()
// eslint-disable-next-line react-refresh/only-export-components
export function useStudents() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudents must be used inside <StudentProvider>')
  return ctx
}
