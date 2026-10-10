import GlassCard from './GlassCard'

// Dashboard statistic tile: icon + label + big value + small hint.
export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <GlassCard className="p-5 transition hover:-translate-y-1 hover:bg-white/15">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-cyan-200">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-cyan-200/70">{hint}</p>}
        </div>
        <div className="shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-3 text-slate-950 shadow-lg">
          <Icon size={22} />
        </div>
      </div>
    </GlassCard>
  )
}
