// Reusable glassmorphism card used across every page.
export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </div>
  )
}
