import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import WaveBackground from './components/WaveBackground'
import AddPerformance from './pages/AddPerformance'
import Dashboard from './pages/Dashboard'
import StudentDetail from './pages/StudentDetail'
import StudentList from './pages/StudentList'

export default function App() {
  return (
    // Ocean gradient background for every page
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 text-white">
      <WaveBackground />

      {/* Content sits above the waves */}
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-32 pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/add" element={<AddPerformance />} />
            {/* Unknown URL -> back to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
