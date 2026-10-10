import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CirclePlus, LayoutDashboard, Menu, Users, Waves, X } from 'lucide-react'

// Navigation links shown in the navbar
const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/add', label: 'Add Performance', icon: CirclePlus },
]

// Active link gets a brighter glass pill
const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white/20 text-white shadow-inner'
      : 'text-cyan-200 hover:bg-white/10 hover:text-white'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false) // mobile menu

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-2 text-slate-950 shadow-lg">
            <Waves size={20} />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-white">Student Tracker</span>
            <span className="hidden text-xs text-cyan-200 sm:block">Daily Performance System</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 p-2 text-cyan-200 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-white/20 px-4 pb-4 pt-2 md:hidden">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
